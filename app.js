/* Romaji Star Typing - game logic */
(function () {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const dom = {
    appTitle: $('#appTitle'),
    appSubtitle: $('#appSubtitle'),
    startScreen: $('#startScreen'),
    gameScreen: $('#gameScreen'),
    resultScreen: $('#resultScreen'),
    lessonSelect: $('#lessonSelect'),
    lessonDescription: $('#lessonDescription'),
    modeButtons: $$('.mode-button'),
    startButton: $('#startButton'),
    soundToggle: $('#soundToggle'),
    timeLeft: $('#timeLeft'),
    score: $('#score'),
    combo: $('#combo'),
    accuracy: $('#accuracy'),
    wordCount: $('#wordCount'),
    wordHint: $('#wordHint'),
    targetCard: $('#targetCard'),
    targetText: $('#targetText'),
    targetKana: $('#targetKana'),
    romajiLine: $('#romajiLine'),
    typedBuffer: $('#typedBuffer'),
    nextKey: $('#nextKey'),
    keyboard: $('#keyboard'),
    level: $('#level'),
    xpText: $('#xpText'),
    xpBar: $('#xpBar'),
    bonusCard: $('#bonusCard'),
    rankOrb: $('#rankOrb'),
    resultTitle: $('#resultTitle'),
    resultRank: $('#resultRank'),
    resultScore: $('#resultScore'),
    resultAccuracy: $('#resultAccuracy'),
    resultKeys: $('#resultKeys'),
    resultWords: $('#resultWords'),
    resultBestCombo: $('#resultBestCombo'),
    resultLevel: $('#resultLevel'),
    resultMessage: $('#resultMessage'),
    retryButton: $('#retryButton'),
    homeButton: $('#homeButton'),
    contentSourceStatus: $('#contentSourceStatus'),
    toast: $('#toast'),
    canvas: $('#fxCanvas')
  };

  const kanaMap = {
    'あ': ['a'], 'い': ['i'], 'う': ['u'], 'え': ['e'], 'お': ['o'],
    'か': ['ka'], 'き': ['ki'], 'く': ['ku'], 'け': ['ke'], 'こ': ['ko'],
    'さ': ['sa'], 'し': ['shi', 'si'], 'す': ['su'], 'せ': ['se'], 'そ': ['so'],
    'た': ['ta'], 'ち': ['chi', 'ti'], 'つ': ['tsu', 'tu'], 'て': ['te'], 'と': ['to'],
    'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
    'は': ['ha'], 'ひ': ['hi'], 'ふ': ['fu', 'hu'], 'へ': ['he'], 'ほ': ['ho'],
    'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
    'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
    'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
    'わ': ['wa'], 'を': ['wo', 'o'],
    'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
    'ざ': ['za'], 'じ': ['ji', 'zi'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
    'だ': ['da'], 'ぢ': ['di', 'ji'], 'づ': ['du', 'zu'], 'で': ['de'], 'ど': ['do'],
    'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
    'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],
    'ゔ': ['vu'],
    'ぁ': ['xa', 'la'], 'ぃ': ['xi', 'li'], 'ぅ': ['xu', 'lu'], 'ぇ': ['xe', 'le'], 'ぉ': ['xo', 'lo'],
    'ゃ': ['xya', 'lya'], 'ゅ': ['xyu', 'lyu'], 'ょ': ['xyo', 'lyo'], 'ゎ': ['xwa', 'lwa'],
    'ゐ': ['wi'], 'ゑ': ['we']
  };

  const digraphMap = {
    'きゃ': ['kya'], 'きゅ': ['kyu'], 'きょ': ['kyo'],
    'しゃ': ['sha', 'sya'], 'しゅ': ['shu', 'syu'], 'しょ': ['sho', 'syo'],
    'ちゃ': ['cha', 'tya', 'cya'], 'ちゅ': ['chu', 'tyu', 'cyu'], 'ちょ': ['cho', 'tyo', 'cyo'],
    'にゃ': ['nya'], 'にゅ': ['nyu'], 'にょ': ['nyo'],
    'ひゃ': ['hya'], 'ひゅ': ['hyu'], 'ひょ': ['hyo'],
    'みゃ': ['mya'], 'みゅ': ['myu'], 'みょ': ['myo'],
    'りゃ': ['rya'], 'りゅ': ['ryu'], 'りょ': ['ryo'],
    'ぎゃ': ['gya'], 'ぎゅ': ['gyu'], 'ぎょ': ['gyo'],
    'じゃ': ['ja', 'jya', 'zya'], 'じゅ': ['ju', 'jyu', 'zyu'], 'じょ': ['jo', 'jyo', 'zyo'],
    'ぢゃ': ['dya', 'ja'], 'ぢゅ': ['dyu', 'ju'], 'ぢょ': ['dyo', 'jo'],
    'びゃ': ['bya'], 'びゅ': ['byu'], 'びょ': ['byo'],
    'ぴゃ': ['pya'], 'ぴゅ': ['pyu'], 'ぴょ': ['pyo'],
    'てぃ': ['thi', 'ti'], 'てゅ': ['thu'], 'でぃ': ['dhi', 'di'], 'でゅ': ['dhu'],
    'とぅ': ['twu', 'tu'], 'どぅ': ['dwu', 'du'],
    'ふぁ': ['fa', 'fwa'], 'ふぃ': ['fi', 'fwi'], 'ふぇ': ['fe', 'fwe'], 'ふぉ': ['fo', 'fwo'], 'ふゅ': ['fyu'],
    'うぁ': ['wha'], 'うぃ': ['wi', 'whi'], 'うぇ': ['we', 'whe'], 'うぉ': ['who'],
    'ゔぁ': ['va'], 'ゔぃ': ['vi'], 'ゔぇ': ['ve'], 'ゔぉ': ['vo'], 'ゔゅ': ['vyu'],
    'つぁ': ['tsa'], 'つぃ': ['tsi'], 'つぇ': ['tse'], 'つぉ': ['tso'],
    'くぁ': ['qa', 'kwa'], 'くぃ': ['qi', 'kwi'], 'くぇ': ['qe', 'kwe'], 'くぉ': ['qo', 'kwo'],
    'ぐぁ': ['gwa'], 'ぐぃ': ['gwi'], 'ぐぇ': ['gwe'], 'ぐぉ': ['gwo']
  };

  const vowelByKana = {
    'あ': 'あ', 'か': 'あ', 'さ': 'あ', 'た': 'あ', 'な': 'あ', 'は': 'あ', 'ま': 'あ', 'や': 'あ', 'ら': 'あ', 'わ': 'あ', 'が': 'あ', 'ざ': 'あ', 'だ': 'あ', 'ば': 'あ', 'ぱ': 'あ', 'ぁ': 'あ',
    'い': 'い', 'き': 'い', 'し': 'い', 'ち': 'い', 'に': 'い', 'ひ': 'い', 'み': 'い', 'り': 'い', 'ぎ': 'い', 'じ': 'い', 'ぢ': 'い', 'び': 'い', 'ぴ': 'い', 'ぃ': 'い', 'ゐ': 'い',
    'う': 'う', 'く': 'う', 'す': 'う', 'つ': 'う', 'ぬ': 'う', 'ふ': 'う', 'む': 'う', 'ゆ': 'う', 'る': 'う', 'ぐ': 'う', 'ず': 'う', 'づ': 'う', 'ぶ': 'う', 'ぷ': 'う', 'ぅ': 'う', 'ゔ': 'う',
    'え': 'え', 'け': 'え', 'せ': 'え', 'て': 'え', 'ね': 'え', 'へ': 'え', 'め': 'え', 'れ': 'え', 'げ': 'え', 'ぜ': 'え', 'で': 'え', 'べ': 'え', 'ぺ': 'え', 'ぇ': 'え', 'ゑ': 'え',
    'お': 'お', 'こ': 'お', 'そ': 'お', 'と': 'お', 'の': 'お', 'ほ': 'お', 'も': 'お', 'よ': 'お', 'ろ': 'お', 'を': 'お', 'ご': 'お', 'ぞ': 'お', 'ど': 'お', 'ぼ': 'お', 'ぽ': 'お', 'ぉ': 'お'
  };

  const smallKana = new Set(['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゃ', 'ゅ', 'ょ', 'ゎ']);
  const punctuationPattern = /[、。，．・!！?？「」『』（）()［］\[\]【】〈〉《》“”\"：:；;〜~…]/g;
  const particles = [];
  const MAX_VARIANTS = 3000;

  const state = {
    content: null,
    lesson: null,
    selectedLessonId: '',
    mode: 'challenge',
    screen: 'start',
    sequence: [],
    currentIndex: 0,
    currentItem: null,
    currentVariants: [],
    currentDefaultRomaji: '',
    input: '',
    isPlaying: false,
    startTime: 0,
    duration: 60,
    timerId: null,
    rafId: null,
    stats: null,
    soundEnabled: true,
    audioContext: null,
    particles: [],
    keyboardKeys: new Map()
  };

  async function init() {
    state.soundEnabled = localStorage.getItem('romajiStarTyping.sound') !== 'off';
    updateSoundButton();
    buildKeyboard();
    setupParticles();
    bindEvents();
    showScreen('start');
    animateParticles();

    setContentLoading(true);
    const loadResult = await RST.loadContentForGame();
    state.content = loadResult.data;
    setContentLoading(false);
    populateLessons();
    renderContentSourceStatus(loadResult);
  }


  function setContentLoading(isLoading) {
    dom.startButton.disabled = isLoading;
    if (isLoading) {
      dom.lessonSelect.innerHTML = '<option>読み込み中...</option>';
      dom.lessonDescription.innerHTML = '共有データ questions.json を確認しています。';
      if (dom.contentSourceStatus) {
        dom.contentSourceStatus.textContent = '出題データを読み込み中...';
        dom.contentSourceStatus.className = 'source-status';
      }
    }
  }

  function renderContentSourceStatus(result) {
    if (!dom.contentSourceStatus || !result) return;
    const labels = {
      shared: '共有データ：questions.json',
      local: '確認モード：このブラウザの保存データ',
      'local-fallback': '代替表示：このブラウザの保存データ',
      'default-fallback': '代替表示：初期データ'
    };
    dom.contentSourceStatus.textContent = `${labels[result.source] || '出題データ'} / ${result.message || ''}`;
    dom.contentSourceStatus.title = result.error || '';
    dom.contentSourceStatus.className = `source-status is-${String(result.source || 'unknown').replace(/[^a-z0-9-]/gi, '')}`;
    if (result.error && result.source !== 'default-fallback') {
      console.warn(result.error);
    }
  }

  function bindEvents() {
    dom.lessonSelect.addEventListener('change', () => {
      state.selectedLessonId = dom.lessonSelect.value;
      updateLessonDescription();
    });

    dom.modeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setMode(button.dataset.mode);
      });
    });

    dom.startButton.addEventListener('click', () => startGame());
    dom.retryButton.addEventListener('click', () => startGame());
    dom.homeButton.addEventListener('click', () => goHome());
    dom.soundToggle.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('romajiStarTyping.sound', state.soundEnabled ? 'on' : 'off');
      updateSoundButton();
    });

    document.addEventListener('keydown', handleGlobalKeydown);
    dom.gameScreen.addEventListener('click', () => dom.gameScreen.focus());
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.isPlaying && state.mode === 'challenge') {
        endGame('paused');
      }
    });
  }

  function populateLessons() {
    dom.appTitle.textContent = state.content.appTitle || RST.DEFAULT_DATA.appTitle;
    dom.appSubtitle.textContent = state.content.appSubtitle || RST.DEFAULT_DATA.appSubtitle;
    dom.lessonSelect.innerHTML = '';
    state.content.lessons.forEach((lesson) => {
      const option = document.createElement('option');
      option.value = lesson.id;
      option.textContent = `${lesson.title}（${lesson.difficulty || '★☆☆'} / ${lesson.words.length}語）`;
      dom.lessonSelect.appendChild(option);
    });
    state.selectedLessonId = state.content.lessons[0]?.id || '';
    dom.lessonSelect.value = state.selectedLessonId;
    updateLessonDescription();
  }

  function setMode(mode) {
    state.mode = mode;
    dom.modeButtons.forEach((button) => {
      button.classList.toggle('is-selected', button.dataset.mode === mode);
    });
    updateLessonDescription();
  }

  function updateLessonDescription() {
    const lesson = getSelectedLesson();
    if (!lesson) return;
    const timeText = state.mode === 'challenge' ? `${lesson.timeLimit || 60}秒` : '時間制限なし';
    dom.lessonDescription.innerHTML = `
      <strong>${escapeHtml(lesson.title)}</strong><br>
      ${escapeHtml(lesson.description || '説明はありません。')}<br>
      <span class="muted">難しさ：${escapeHtml(lesson.difficulty || '★☆☆')} / 出題：${lesson.words.length}語 / 目安：${timeText}</span>
    `;
  }

  function getSelectedLesson() {
    return state.content.lessons.find((lesson) => lesson.id === state.selectedLessonId) || state.content.lessons[0];
  }

  function startGame() {
    if (!state.content) {
      toast('出題データを読み込み中です。');
      return;
    }
    unlockAudio();
    const lesson = getSelectedLesson();
    if (!lesson || !lesson.words.length) {
      toast('出題データがありません。管理者ページで設定してください。');
      return;
    }

    state.lesson = lesson;
    state.duration = Math.max(15, Number(lesson.timeLimit) || 60);
    state.sequence = shuffle(lesson.words).map(prepareWord).filter((item) => item.variants.length > 0);
    if (!state.sequence.length) {
      toast('ローマ字に変換できる出題がありません。kanaを確認してください。');
      return;
    }
    state.currentIndex = 0;
    state.currentItem = null;
    state.input = '';
    state.isPlaying = true;
    state.startTime = performance.now();
    state.stats = {
      hits: 0,
      misses: 0,
      keystrokes: 0,
      score: 0,
      combo: 0,
      bestCombo: 0,
      wordsCleared: 0,
      level: 1,
      xp: 0,
      mistakesInWord: 0
    };

    showScreen('game');
    nextWord();
    renderHud();
    dom.gameScreen.focus();

    clearInterval(state.timerId);
    state.timerId = setInterval(tick, 120);
    tick();
    playStartSound();
  }

  function prepareWord(word) {
    const generated = kanaToRomajiVariants(word.kana || word.text || '');
    const custom = normalizeCustomRomaji(word.romaji);
    const variants = unique([...custom, ...generated])
      .map((value) => value.toLowerCase().replace(/\s+/g, ''))
      .filter(Boolean)
      .slice(0, MAX_VARIANTS);
    return {
      ...word,
      variants,
      defaultRomaji: variants[0] || '',
      normalizedKana: normalizeKana(word.kana || word.text || '')
    };
  }

  function nextWord() {
    if (state.mode === 'practice' && state.currentIndex >= state.sequence.length) {
      endGame('complete');
      return;
    }
    if (state.currentIndex >= state.sequence.length) {
      state.sequence = shuffle(state.lesson.words).map(prepareWord).filter((item) => item.variants.length > 0);
      state.currentIndex = 0;
    }

    state.currentItem = state.sequence[state.currentIndex];
    state.currentVariants = state.currentItem.variants;
    state.currentDefaultRomaji = state.currentItem.defaultRomaji;
    state.input = '';
    state.stats.mistakesInWord = 0;
    renderTarget();
  }

  function tick() {
    if (!state.isPlaying) return;
    if (state.mode === 'practice') {
      dom.timeLeft.textContent = '∞';
      return;
    }
    const elapsed = (performance.now() - state.startTime) / 1000;
    const left = Math.max(0, state.duration - elapsed);
    dom.timeLeft.textContent = Math.ceil(left).toString();
    if (left <= 0) {
      endGame('timeup');
    }
  }

  function handleGlobalKeydown(event) {
    if (event.isComposing) return;

    if (event.key === 'Escape') {
      if (state.screen === 'game' || state.screen === 'result') {
        event.preventDefault();
        goHome();
      }
      return;
    }

    if (event.code === 'Space') {
      if (state.screen === 'start') {
        event.preventDefault();
        startGame();
        return;
      }
      if (state.screen === 'result') {
        event.preventDefault();
        startGame();
        return;
      }
    }

    if (state.screen !== 'game' || !state.isPlaying) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (!/^[a-z'\-]$/.test(key)) return;
    event.preventDefault();
    processKey(key);
  }

  function processKey(key) {
    pulseKeyboardKey(key);
    const candidate = state.input + key;
    state.stats.keystrokes += 1;

    if (state.currentVariants.some((variant) => variant.startsWith(candidate))) {
      state.input = candidate;
      state.stats.hits += 1;
      state.stats.combo += 1;
      state.stats.bestCombo = Math.max(state.stats.bestCombo, state.stats.combo);
      const comboBonus = Math.min(4, Math.floor(state.stats.combo / 12));
      state.stats.score += state.stats.level + comboBonus;
      state.stats.xp += 7 + Math.min(28, state.stats.combo) * 0.55;
      while (state.stats.xp >= 100 && state.stats.level < 9) {
        state.stats.xp -= 100;
        state.stats.level += 1;
        toast(`レベル${state.stats.level}！ スター召喚パワーアップ！`);
        spawnBurst(window.innerWidth * 0.82, window.innerHeight * 0.25, 38, 'level');
        playLevelSound();
      }
      if (state.stats.level >= 9) state.stats.xp = Math.min(100, state.stats.xp);
      renderTarget();
      renderHud();
      animateHit();
      spawnTypingStars(Math.min(18, state.stats.level + comboBonus));
      playHitSound();

      if (state.currentVariants.includes(state.input)) {
        completeWord();
      }
    } else {
      state.stats.misses += 1;
      state.stats.combo = 0;
      state.stats.mistakesInWord += 1;
      state.stats.xp = Math.max(0, state.stats.xp - 9);
      renderHud();
      animateMiss();
      spawnBurst(window.innerWidth / 2, window.innerHeight * 0.55, 12, 'miss');
      playMissSound();
    }
  }

  function completeWord() {
    state.stats.wordsCleared += 1;
    const perfectBonus = state.stats.mistakesInWord === 0 ? 20 + state.stats.level * 4 : 8 + state.stats.level;
    state.stats.score += perfectBonus;
    spawnBurst(window.innerWidth / 2, window.innerHeight * 0.38, 34 + state.stats.level * 4, 'word');
    playWordSound();
    state.currentIndex += 1;
    renderHud();
    setTimeout(() => {
      if (state.isPlaying) nextWord();
    }, 120);
  }

  function endGame(reason) {
    if (!state.isPlaying && state.screen === 'result') return;
    state.isPlaying = false;
    clearInterval(state.timerId);
    state.timerId = null;
    showResults(reason);
    showScreen('result');
    spawnBurst(window.innerWidth / 2, window.innerHeight * 0.34, 80, 'result');
  }

  function goHome() {
    state.isPlaying = false;
    clearInterval(state.timerId);
    showScreen('start');
    updateLessonDescription();
  }

  function renderTarget() {
    const item = state.currentItem;
    if (!item) return;
    const best = chooseVariant(state.input, state.currentVariants, state.currentDefaultRomaji);
    const typed = best.slice(0, state.input.length);
    const cursor = best.slice(state.input.length, state.input.length + 1);
    const remaining = best.slice(state.input.length + 1);
    dom.targetText.textContent = item.text || item.kana;
    dom.targetKana.textContent = item.kana || item.text;
    dom.wordHint.textContent = item.hint || '正確に打つとレベルアップ！';
    if (state.mode === 'practice') {
      dom.wordCount.textContent = `${Math.min(state.currentIndex + 1, state.sequence.length)} / ${state.sequence.length}`;
    } else {
      dom.wordCount.textContent = `${state.stats.wordsCleared + 1}問目`;
    }
    dom.romajiLine.innerHTML = `${span('typed', typed)}${cursor ? span('cursor', cursor) : ''}${span('remaining', remaining)}`;
    dom.typedBuffer.textContent = state.input ? `入力：${state.input}` : '入力：';
    updateNextKey(best[state.input.length] || '');
  }

  function renderHud() {
    const stats = state.stats || { hits: 0, misses: 0, keystrokes: 0, score: 0, combo: 0, level: 1, xp: 0 };
    const total = stats.hits + stats.misses;
    const accuracy = total ? Math.round((stats.hits / total) * 100) : 100;
    dom.score.textContent = String(stats.score);
    dom.combo.textContent = String(stats.combo);
    dom.accuracy.textContent = `${accuracy}%`;
    dom.level.textContent = String(stats.level);
    dom.xpText.textContent = `${Math.round(stats.xp)}%`;
    dom.xpBar.style.width = `${Math.min(100, Math.max(0, stats.xp))}%`;
    dom.bonusCard.classList.toggle('is-hot', stats.combo >= 10);
    dom.rankOrb.style.filter = stats.combo >= 20 ? 'drop-shadow(0 0 28px rgba(255,230,109,.35))' : '';
  }

  function showResults(reason) {
    const stats = state.stats || { hits: 0, misses: 0, keystrokes: 0, score: 0, combo: 0, bestCombo: 0, wordsCleared: 0, level: 1 };
    const total = stats.hits + stats.misses;
    const accuracy = total ? Math.round((stats.hits / total) * 100) : 100;
    const rank = getRank(stats.score, accuracy, stats.wordsCleared, stats.level);
    const title = reason === 'paused' ? 'ここまでの記録' : rank.title;
    dom.resultTitle.textContent = title;
    dom.resultRank.textContent = rank.rank;
    dom.resultScore.textContent = String(stats.score);
    dom.resultAccuracy.textContent = `${accuracy}%`;
    dom.resultKeys.textContent = String(stats.keystrokes);
    dom.resultWords.textContent = String(stats.wordsCleared);
    dom.resultBestCombo.textContent = String(stats.bestCombo);
    dom.resultLevel.textContent = String(stats.level);
    dom.resultMessage.textContent = rank.message;
    saveBestRecord(stats, accuracy, rank.rank);
  }

  function getRank(score, accuracy, words, level) {
    if (accuracy >= 98 && score >= 700 && level >= 6) {
      return { rank: 'S', title: '伝説のスタータイパー！', message: 'すごい正確さです。速さよりも正しく打つ力がしっかり育っています。' };
    }
    if (accuracy >= 94 && score >= 430) {
      return { rank: 'A', title: 'スーパータイパー！', message: 'コンボがよく続いています。次はミスをさらに少なくしてSランクをねらおう。' };
    }
    if (accuracy >= 88 && score >= 220) {
      return { rank: 'B', title: 'ナイスタイピング！', message: 'リズムよく打てています。迷ったキーだけ、ゆっくり確認してみよう。' };
    }
    if (words >= 3) {
      return { rank: 'C', title: 'ミッション成功！', message: '最後まで挑戦できました。次は「正確にゆっくり」を合言葉にしてみよう。' };
    }
    return { rank: 'D', title: 'はじめの一歩！', message: 'まずはホームポジションに手を置いて、1文字ずつ正しく打ってみよう。' };
  }

  function saveBestRecord(stats, accuracy, rank) {
    const key = `romajiStarTyping.best.${state.lesson?.id || 'unknown'}.${state.mode}`;
    const previous = safeJson(localStorage.getItem(key));
    if (!previous || stats.score > previous.score) {
      localStorage.setItem(key, JSON.stringify({
        score: stats.score,
        accuracy,
        rank,
        words: stats.wordsCleared,
        level: stats.level,
        date: new Date().toISOString()
      }));
    }
  }

  function showScreen(screen) {
    state.screen = screen;
    dom.startScreen.classList.toggle('is-active', screen === 'start');
    dom.gameScreen.classList.toggle('is-active', screen === 'game');
    dom.resultScreen.classList.toggle('is-active', screen === 'result');
  }

  function animateHit() {
    dom.targetCard.classList.remove('is-hit');
    void dom.targetCard.offsetWidth;
    dom.targetCard.classList.add('is-hit');
  }

  function animateMiss() {
    dom.targetCard.classList.remove('is-miss');
    void dom.targetCard.offsetWidth;
    dom.targetCard.classList.add('is-miss');
  }

  function updateNextKey(key) {
    dom.nextKey.textContent = key ? key.toUpperCase() : '✓';
    state.keyboardKeys.forEach((el, value) => {
      el.classList.toggle('is-next', value === key);
    });
  }

  function buildKeyboard() {
    const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    dom.keyboard.innerHTML = '';
    state.keyboardKeys.clear();
    rows.forEach((rowText) => {
      const row = document.createElement('div');
      row.className = 'key-row';
      rowText.split('').forEach((letter) => {
        const key = document.createElement('div');
        key.className = 'key';
        key.textContent = letter;
        row.appendChild(key);
        state.keyboardKeys.set(letter, key);
      });
      dom.keyboard.appendChild(row);
    });
  }

  function pulseKeyboardKey(key) {
    const el = state.keyboardKeys.get(key);
    if (!el) return;
    el.classList.add('is-pressed');
    setTimeout(() => el.classList.remove('is-pressed'), 120);
  }

  function setupParticles() {
    resizeCanvas();
  }

  function resizeCanvas() {
    const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    dom.canvas.width = Math.floor(window.innerWidth * ratio);
    dom.canvas.height = Math.floor(window.innerHeight * ratio);
    dom.canvas.style.width = `${window.innerWidth}px`;
    dom.canvas.style.height = `${window.innerHeight}px`;
    const ctx = dom.canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function spawnTypingStars(count) {
    const rect = dom.targetCard.getBoundingClientRect();
    const x = rect.left + rect.width * (0.35 + Math.random() * 0.3);
    const y = rect.top + rect.height * (0.45 + Math.random() * 0.2);
    spawnBurst(x, y, count, 'hit');
  }

  function spawnBurst(x, y, count, kind) {
    const palette = kind === 'miss'
      ? ['#ff6882', '#ffb1bf', '#ffd1d8']
      : kind === 'level'
        ? ['#ffe66d', '#74ffc4', '#68e8ff', '#ffffff']
        : ['#68e8ff', '#b580ff', '#ff77d9', '#ffe66d', '#74ffc4'];

    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * (kind === 'result' ? 7 : 4.5);
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2.2,
        size: 3 + Math.random() * (kind === 'result' ? 8 : 6),
        life: 42 + Math.random() * 36,
        maxLife: 78,
        color: palette[Math.floor(Math.random() * palette.length)],
        rotate: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.28,
        shape: Math.random() > 0.35 ? 'star' : 'circle'
      });
    }
    if (state.particles.length > 700) state.particles.splice(0, state.particles.length - 700);
  }

  function animateParticles() {
    const ctx = dom.canvas.getContext('2d');
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const particle = state.particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.075;
      particle.vx *= 0.992;
      particle.life -= 1;
      particle.rotate += particle.spin;
      const alpha = Math.max(0, particle.life / particle.maxLife);

      ctx.save();
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotate);
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 18;
      ctx.shadowColor = particle.color;
      if (particle.shape === 'star') drawStar(ctx, 0, 0, particle.size, particle.size * 0.45, 5);
      else {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (particle.life <= 0 || particle.y > window.innerHeight + 40) {
        state.particles.splice(i, 1);
      }
    }
    state.rafId = requestAnimationFrame(animateParticles);
  }

  function drawStar(ctx, x, y, outerRadius, innerRadius, points) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i += 1) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = -Math.PI / 2 + (i * Math.PI) / points;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  function unlockAudio() {
    if (!state.soundEnabled) return;
    if (!state.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      state.audioContext = new AudioContext();
    }
    if (state.audioContext.state === 'suspended') {
      state.audioContext.resume().catch(() => {});
    }
  }

  function playTone(frequency, duration = 0.05, type = 'sine', gainValue = 0.035) {
    if (!state.soundEnabled) return;
    unlockAudio();
    const ctx = state.audioContext;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.015);
  }

  function playHitSound() {
    playTone(540 + state.stats.level * 26, 0.045, 'triangle', 0.03);
  }

  function playMissSound() {
    playTone(150, 0.08, 'sawtooth', 0.025);
  }

  function playWordSound() {
    playTone(760, 0.08, 'square', 0.028);
    setTimeout(() => playTone(980, 0.07, 'triangle', 0.024), 45);
  }

  function playLevelSound() {
    playTone(660, 0.08, 'triangle', 0.03);
    setTimeout(() => playTone(880, 0.08, 'triangle', 0.03), 70);
    setTimeout(() => playTone(1180, 0.12, 'triangle', 0.025), 140);
  }

  function playStartSound() {
    playTone(420, 0.08, 'triangle', 0.025);
    setTimeout(() => playTone(640, 0.08, 'triangle', 0.025), 85);
  }

  function updateSoundButton() {
    dom.soundToggle.textContent = state.soundEnabled ? '🔊 サウンド' : '🔇 サウンド';
    dom.soundToggle.setAttribute('aria-pressed', String(state.soundEnabled));
  }

  function normalizeCustomRomaji(romaji) {
    if (!romaji) return [];
    const values = Array.isArray(romaji) ? romaji : [romaji];
    return values.map((value) => String(value).toLowerCase().replace(/\s+/g, '').trim()).filter(Boolean);
  }

  function kanaToRomajiVariants(rawKana) {
    const kana = normalizeKana(rawKana);
    if (!kana) return [];
    const chars = Array.from(kana);
    const memo = new Map();

    function rec(index) {
      if (index >= chars.length) return [''];
      if (memo.has(index)) return memo.get(index);

      const char = chars[index];
      let result = [];

      if (char === 'っ') {
        const tails = rec(index + 1);
        const doubled = [];
        tails.forEach((tail) => {
          const first = tail[0];
          if (first && !'aeioun'.includes(first)) doubled.push(first + tail);
        });
        result = unique([...doubled, ...combine(['xtu', 'ltu', 'xtsu', 'ltsu'], tails)]);
        memo.set(index, result.slice(0, MAX_VARIANTS));
        return memo.get(index);
      }

      if (char === 'ん') {
        const next = chars[index + 1] || '';
        const options = needsDoubleN(next) ? ['nn', "n'"] : ['n', 'nn'];
        result = combine(options, rec(index + 1));
        memo.set(index, result.slice(0, MAX_VARIANTS));
        return memo.get(index);
      }

      const pair = char + (chars[index + 1] || '');
      if (digraphMap[pair]) {
        result = combine(digraphMap[pair], rec(index + 2));
        memo.set(index, result.slice(0, MAX_VARIANTS));
        return memo.get(index);
      }

      if (kanaMap[char]) {
        result = combine(kanaMap[char], rec(index + 1));
      } else if (/^[a-zA-Z0-9'\-]$/.test(char)) {
        result = combine([char.toLowerCase()], rec(index + 1));
      } else {
        result = rec(index + 1);
      }

      memo.set(index, unique(result).slice(0, MAX_VARIANTS));
      return memo.get(index);
    }

    return unique(rec(0)).slice(0, MAX_VARIANTS);
  }

  function normalizeKana(raw) {
    let text = String(raw || '').trim();
    text = text.replace(punctuationPattern, '').replace(/[\s\u3000]/g, '');
    text = Array.from(text).map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 0x30a1 && code <= 0x30f6) {
        return String.fromCharCode(code - 0x60);
      }
      if (char === 'ヵ') return 'か';
      if (char === 'ヶ') return 'け';
      return char;
    }).join('');
    return expandLongVowels(text);
  }

  function expandLongVowels(text) {
    const chars = Array.from(text);
    const out = [];
    let lastVowel = '';
    chars.forEach((char) => {
      if (char === 'ー') {
        out.push(lastVowel || '');
        return;
      }
      out.push(char);
      if (vowelByKana[char]) lastVowel = vowelByKana[char];
      if (smallKana.has(char)) {
        if (char === 'ゃ' || char === 'ぁ') lastVowel = 'あ';
        if (char === 'ゅ' || char === 'ぅ') lastVowel = 'う';
        if (char === 'ょ' || char === 'ぉ') lastVowel = 'お';
        if (char === 'ぃ') lastVowel = 'い';
        if (char === 'ぇ') lastVowel = 'え';
      }
    });
    return out.join('');
  }

  function needsDoubleN(nextKana) {
    if (!nextKana) return false;
    if ('あいうえおやゆよんぁぃぅぇぉゃゅょ'.includes(nextKana)) return true;
    const pairLike = `${nextKana}`;
    return false || particles.includes(pairLike);
  }

  function combine(prefixes, tails) {
    const result = [];
    for (const prefix of prefixes) {
      for (const tail of tails) {
        result.push(prefix + tail);
        if (result.length >= MAX_VARIANTS) return result;
      }
    }
    return result;
  }

  function chooseVariant(input, variants, fallback) {
    if (!input) return fallback || variants[0] || '';
    const exactPrefix = variants.find((variant) => variant.startsWith(input));
    if (exactPrefix) return exactPrefix;
    return fallback || variants[0] || '';
  }

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function unique(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function span(className, text) {
    return `<span class="${className}">${escapeHtml(text)}</span>`;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
    }[char]));
  }

  function safeJson(value) {
    try {
      return JSON.parse(value);
    } catch (_error) {
      return null;
    }
  }

  function toast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add('is-showing');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => dom.toast.classList.remove('is-showing'), 2800);
  }

  init();
})();
