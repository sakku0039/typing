/* Romaji Star Typing - shared data and validation helpers */
(function () {
  'use strict';

  const SCHEMA = 'romaji-star-typing.v1';
  const STORAGE_KEY = 'romajiStarTyping.content.v1';
  const SHARED_DATA_URL = 'questions.json';
  const ADMIN_HASH_KEY = 'romajiStarTyping.adminHash.v1';
  const ADMIN_SESSION_KEY = 'romajiStarTyping.adminSession.v1';

  const DEFAULT_DATA = {
    schema: SCHEMA,
    appTitle: 'ローマ字スタータイピング',
    appSubtitle: 'キーボードでスターを集める、ローマ字入力トレーニング',
    lessons: [
      {
        id: 'starter-basic',
        title: 'はじめての ローマ字',
        description: '短いことばで、キーの場所になれよう。',
        difficulty: '★☆☆',
        timeLimit: 60,
        words: [
          { text: 'あさ', kana: 'あさ', hint: 'a-sa' },
          { text: 'いぬ', kana: 'いぬ', hint: 'i-nu' },
          { text: 'うみ', kana: 'うみ', hint: 'u-mi' },
          { text: 'えき', kana: 'えき', hint: 'e-ki' },
          { text: 'おに', kana: 'おに', hint: 'o-ni' },
          { text: 'かき', kana: 'かき', hint: 'ka-ki' },
          { text: 'くま', kana: 'くま', hint: 'ku-ma' },
          { text: 'ねこ', kana: 'ねこ', hint: 'ne-ko' },
          { text: 'そら', kana: 'そら', hint: 'so-ra' },
          { text: 'もり', kana: 'もり', hint: 'mo-ri' }
        ]
      },
      {
        id: 'school-life',
        title: '学校ミッション',
        description: '学校でよく使うことばを打ってみよう。',
        difficulty: '★★☆',
        timeLimit: 60,
        words: [
          { text: 'がっこう', kana: 'がっこう', hint: '小さい「っ」は次の子音を重ねる' },
          { text: 'せんせい', kana: 'せんせい', hint: 'ん の入力に注意' },
          { text: 'きょうしつ', kana: 'きょうしつ', hint: 'kyo の練習' },
          { text: 'きゅうしょく', kana: 'きゅうしょく', hint: 'kyu / sho' },
          { text: 'ともだち', kana: 'ともだち', hint: 'chi / ti どちらでもOK' },
          { text: 'えんぴつ', kana: 'えんぴつ', hint: 'tsu / tu どちらでもOK' },
          { text: 'にっき', kana: 'にっき', hint: '小さい「っ」' },
          { text: 'としょしつ', kana: 'としょしつ', hint: 'sho' },
          { text: 'しょうがっこう', kana: 'しょうがっこう', hint: '長めのチャレンジ' },
          { text: 'たいいく', kana: 'たいいく', hint: '母音が続くことば' }
        ]
      },
      {
        id: 'adventure',
        title: 'スター冒険コース',
        description: 'かっこいいことばでコンボをねらおう。',
        difficulty: '★★☆',
        timeLimit: 60,
        words: [
          { text: 'ほしぞら', kana: 'ほしぞら', hint: '星空' },
          { text: 'まほう', kana: 'まほう', hint: '魔法' },
          { text: 'ゆうしゃ', kana: 'ゆうしゃ', hint: 'sha / sya どちらでもOK' },
          { text: 'ぼうけん', kana: 'ぼうけん', hint: '冒険' },
          { text: 'たからもの', kana: 'たからもの', hint: '宝物' },
          { text: 'ひみつきち', kana: 'ひみつきち', hint: '秘密基地' },
          { text: 'きらきら', kana: 'きらきら', hint: '連続入力' },
          { text: 'りゅうせい', kana: 'りゅうせい', hint: 'ryu の練習' },
          { text: 'でんせつ', kana: 'でんせつ', hint: '伝説' },
          { text: 'ちからもち', kana: 'ちからもち', hint: 'chi / ti' }
        ]
      },
      {
        id: 'positive-words',
        title: '元気ことばチャレンジ',
        description: '毎日使える、気持ちのよいことば。',
        difficulty: '★★★',
        timeLimit: 60,
        words: [
          { text: 'ありがとう', kana: 'ありがとう', hint: 'ありがとう' },
          { text: 'おはよう', kana: 'おはよう', hint: '朝のあいさつ' },
          { text: 'こんにちは', kana: 'こんにちは', hint: 'konnichiwa / konnichiha どちらでもOK', romaji: ['konnichiwa', 'konnichiha'] },
          { text: 'さようなら', kana: 'さようなら', hint: 'あいさつ' },
          { text: 'おめでとう', kana: 'おめでとう', hint: 'お祝い' },
          { text: 'だいじょうぶ', kana: 'だいじょうぶ', hint: '安心のことば' },
          { text: 'たのしい', kana: 'たのしい', hint: '楽しい' },
          { text: 'がんばる', kana: 'がんばる', hint: 'ん に注意' },
          { text: 'しっぱいしてもだいじょうぶ', kana: 'しっぱいしてもだいじょうぶ', hint: '長文に挑戦' },
          { text: 'ゆっくりただしくうとう', kana: 'ゆっくりただしくうとう', hint: '正確さを大切に' }
        ]
      }
    ]
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function slugify(text, fallback) {
    const base = String(text || '')
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/\-+/g, '-')
      .replace(/^\-+|\-+$/g, '');
    return base || fallback;
  }

  function validateContent(raw) {
    const errors = [];
    let data = raw;

    if (typeof raw === 'string') {
      try {
        data = JSON.parse(raw);
      } catch (error) {
        return { ok: false, errors: ['JSONとして読み込めません。カンマや引用符を確認してください。'], data: null };
      }
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { ok: false, errors: ['一番外側はオブジェクトにしてください。'], data: null };
    }

    const normalized = {
      schema: data.schema || SCHEMA,
      appTitle: String(data.appTitle || DEFAULT_DATA.appTitle).trim(),
      appSubtitle: String(data.appSubtitle || DEFAULT_DATA.appSubtitle).trim(),
      lessons: []
    };

    if (data.schema && data.schema !== SCHEMA) {
      errors.push(`schema は "${SCHEMA}" にしてください。`);
    }
    if (!Array.isArray(data.lessons) || data.lessons.length === 0) {
      errors.push('lessons は1件以上の配列にしてください。');
    } else {
      data.lessons.forEach((lesson, index) => {
        if (!lesson || typeof lesson !== 'object') {
          errors.push(`lessons[${index}] はオブジェクトにしてください。`);
          return;
        }
        const title = String(lesson.title || '').trim();
        if (!title) errors.push(`lessons[${index}].title がありません。`);
        if (!Array.isArray(lesson.words) || lesson.words.length === 0) {
          errors.push(`「${title || `lessons[${index}]`}」の words は1件以上にしてください。`);
        }
        const normalizedLesson = {
          id: String(lesson.id || slugify(title, `lesson-${index + 1}`)).trim(),
          title,
          description: String(lesson.description || '').trim(),
          difficulty: String(lesson.difficulty || '★☆☆').trim(),
          timeLimit: Number.isFinite(Number(lesson.timeLimit)) ? Math.max(15, Math.min(300, Math.round(Number(lesson.timeLimit)))) : 60,
          words: []
        };
        (lesson.words || []).forEach((word, wordIndex) => {
          if (!word || typeof word !== 'object') {
            errors.push(`「${title}」の words[${wordIndex}] はオブジェクトにしてください。`);
            return;
          }
          const text = String(word.text || word.kana || '').trim();
          const kana = String(word.kana || '').trim();
          if (!text) errors.push(`「${title}」の words[${wordIndex}].text がありません。`);
          if (!kana) errors.push(`「${title}」の words[${wordIndex}].kana がありません。`);
          const normalizedWord = {
            text,
            kana,
            hint: String(word.hint || '').trim()
          };
          if (word.romaji !== undefined) {
            if (Array.isArray(word.romaji)) {
              normalizedWord.romaji = word.romaji.map((v) => String(v).toLowerCase().trim()).filter(Boolean);
            } else {
              normalizedWord.romaji = String(word.romaji).toLowerCase().trim();
            }
          }
          normalizedLesson.words.push(normalizedWord);
        });
        normalized.lessons.push(normalizedLesson);
      });
    }

    return { ok: errors.length === 0, errors, data: normalized };
  }

  function loadContent() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return clone(DEFAULT_DATA);
    const checked = validateContent(saved);
    if (!checked.ok) {
      console.warn('保存済みデータに問題があるため初期データを使用します:', checked.errors);
      return clone(DEFAULT_DATA);
    }
    return checked.data;
  }

  function saveContent(data) {
    const checked = validateContent(data);
    if (!checked.ok) return checked;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked.data, null, 2));
    return checked;
  }

  function resetContent() {
    localStorage.removeItem(STORAGE_KEY);
    return clone(DEFAULT_DATA);
  }

  function shouldSkipSharedFetch() {
    return window.location.protocol === 'file:';
  }

  function withCacheBust(url) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_=${Date.now()}`;
  }

  async function loadSharedContent() {
    if (shouldSkipSharedFetch()) {
      throw new Error('ローカルファイルとして開いているため、questions.json の自動読み込みはスキップしました。');
    }

    const response = await fetch(withCacheBust(SHARED_DATA_URL), { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`questions.json を読み込めませんでした（HTTP ${response.status}）。`);
    }

    const text = await response.text();
    const checked = validateContent(text);
    if (!checked.ok) {
      throw new Error(`questions.json の形式に問題があります：${checked.errors.join(' / ')}`);
    }
    return checked.data;
  }

  async function loadContentForGame() {
    const params = new URLSearchParams(window.location.search);
    const useLocalPreview = params.get('source') === 'local' || params.has('local');

    if (useLocalPreview) {
      return {
        data: loadContent(),
        source: 'local',
        message: 'このブラウザに保存したデータで確認中です。クラス共有用URLでは questions.json が優先されます。'
      };
    }

    try {
      return {
        data: await loadSharedContent(),
        source: 'shared',
        message: '共有データ questions.json を読み込みました。'
      };
    } catch (error) {
      const hasLocalDraft = Boolean(localStorage.getItem(STORAGE_KEY));
      return {
        data: loadContent(),
        source: hasLocalDraft ? 'local-fallback' : 'default-fallback',
        error: error && error.message ? error.message : String(error),
        message: hasLocalDraft
          ? '共有データを読み込めないため、このブラウザに保存したデータを使っています。'
          : '共有データを読み込めないため、初期データを使っています。'
      };
    }
  }

  function buildAIPrompt() {
    const sample = {
      schema: SCHEMA,
      appTitle: 'ローマ字スタータイピング',
      appSubtitle: '小学生向けのローマ字入力練習',
      lessons: [
        {
          id: 'summer-science',
          title: '夏の理科ことば',
          description: '小学3〜4年生が楽しく打てる理科のことば。',
          difficulty: '★★☆',
          timeLimit: 60,
          words: [
            { text: 'ひまわり', kana: 'ひまわり', hint: '夏の花' },
            { text: 'こんちゅう', kana: 'こんちゅう', hint: 'ん、ちゅ の練習' },
            { text: 'じっけん', kana: 'じっけん', hint: '小さい「っ」' }
          ]
        }
      ]
    };

    return `あなたは小学生向けタイピング教材を作る編集者です。次のWebアプリにインポートできるJSONデータを作成してください。生成したJSONは、管理者ページに貼り付けるか、questions.json というファイル名で公開してクラス共有に使います。\n\n【出力ルール】\n- JSONだけを出力してください。Markdown、説明文、コードフェンスは不要です。
- 生成結果はそのまま questions.json として保存できる形式にしてください。\n- schema は必ず "${SCHEMA}" にしてください。\n- lessons は3〜6件、各lessonのwordsは8〜20件にしてください。\n- text は画面に出す日本語、kana はローマ字入力に変換する読みを「ひらがな中心」で書いてください。漢字を使う場合も kana は必ず入れてください。\n- 小学生が楽しく、前向きに練習できる題材にしてください。\n- kana には空欄を入れないでください。小さい「っ」「ゃ」「ゅ」「ょ」や「ん」を含む語も少し入れてください。\n- romaji は通常は省略してください。特別な読みを強制したい場合だけ、文字列または文字列配列で指定できます。\n- difficulty は "★☆☆" "★★☆" "★★★" のいずれかにしてください。\n- timeLimit は通常60にしてください。\n\n【JSON形式】\n${JSON.stringify(sample, null, 2)}\n\n【作成したいテーマ】\nここにテーマ、学年、単元、行事、好きなキャラクター性、難しさなどを追記してから生成してください。`;
  }

  window.RST = {
    SCHEMA,
    STORAGE_KEY,
    SHARED_DATA_URL,
    ADMIN_HASH_KEY,
    ADMIN_SESSION_KEY,
    DEFAULT_DATA,
    clone,
    validateContent,
    loadContent,
    saveContent,
    resetContent,
    loadSharedContent,
    loadContentForGame,
    buildAIPrompt
  };
})();
