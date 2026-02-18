const {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus
} = require("@discordjs/voice");
const play = require("play-dl");

const states = new Map();

function getState(guildId) {
  if (!states.has(guildId)) {
    const player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause }
    });

    const state = {
      player,
      connection: null,
      queue: [],
      current: null
    };

    player.on(AudioPlayerStatus.Idle, () => {
      playNext(guildId).catch(error => console.error("Error al continuar música:", error));
    });

    player.on("error", error => {
      console.error("Error de audio:", error);
      playNext(guildId).catch(nextError => console.error("Error tras fallo de audio:", nextError));
    });

    states.set(guildId, state);
  }

  return states.get(guildId);
}

async function resolveTrack(query) {
  const isUrl = play.yt_validate(query) === "video" || play.yt_validate(query) === "playlist";

  if (isUrl) {
    const info = await play.video_basic_info(query);
    return {
      title: info.video_details.title,
      url: info.video_details.url
    };
  }

  const result = await play.search(query, { limit: 1 });
  if (!result.length) return null;

  return {
    title: result[0].title,
    url: result[0].url
  };
}

async function ensureConnection(guild, voiceChannel, state) {
  if (!state.connection || state.connection.joinConfig.channelId !== voiceChannel.id) {
    state.connection?.destroy();

    state.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true
    });

    state.connection.subscribe(state.player);

    await entersState(state.connection, VoiceConnectionStatus.Ready, 20_000);
  }
}

async function playNext(guildId) {
  const state = getState(guildId);
  const next = state.queue.shift();

  if (!next) {
    state.current = null;
    return;
  }

  state.current = next;
  const stream = await play.stream(next.url);
  const resource = createAudioResource(stream.stream, {
    inputType: stream.type
  });

  state.player.play(resource);
}

async function enqueueTrack({ guild, voiceChannel, query }) {
  const state = getState(guild.id);
  await ensureConnection(guild, voiceChannel, state);

  const track = await resolveTrack(query);
  if (!track) {
    return { ok: false, error: "No encontré resultados para esa búsqueda." };
  }

  state.queue.push(track);

  if (!state.current && state.player.state.status !== AudioPlayerStatus.Playing) {
    await playNext(guild.id);
  }

  return {
    ok: true,
    track,
    queueSize: state.queue.length,
    current: state.current
  };
}

function skipTrack(guildId) {
  const state = getState(guildId);
  if (!state.current) {
    return { ok: false, error: "No hay música reproduciéndose." };
  }

  state.player.stop();
  return { ok: true };
}

function stopMusic(guildId) {
  const state = getState(guildId);
  state.queue = [];
  state.current = null;
  state.player.stop(true);
  state.connection?.destroy();
  state.connection = null;
  return { ok: true };
}

function getQueueSnapshot(guildId) {
  const state = getState(guildId);
  return {
    current: state.current,
    queue: [...state.queue]
  };
}

module.exports = {
  enqueueTrack,
  getQueueSnapshot,
  skipTrack,
  stopMusic
};