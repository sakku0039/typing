/* Romaji Star Typing - admin page */
(function () {
  'use strict';

  const $ = (selector) => document.querySelector(selector);

  const DEFAULT_ADMIN_HASH = '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0'; // default password: 0000

  const dom = {
    loginView: $('#loginView'),
    adminView: $('#adminView'),
    loginForm: $('#loginForm'),
    adminPassword: $('#adminPassword'),
    logoutButton: $('#logoutButton'),
    jsonEditor: $('#jsonEditor'),
    validationResult: $('#validationResult'),
    importFile: $('#importFile'),
    validateButton: $('#validateButton'),
    saveButton: $('#saveButton'),
    resetButton: $('#resetButton'),
    formatButton: $('#formatButton'),
    loadSharedButton: $('#loadSharedButton'),
    exportButton: $('#exportButton'),
    shareExportButton: $('#shareExportButton'),
    contentPreview: $('#contentPreview'),
    aiPrompt: $('#aiPrompt'),
    copyPromptButton: $('#copyPromptButton'),
    passwordForm: $('#passwordForm'),
    newPassword: $('#newPassword'),
    newPasswordConfirm: $('#newPasswordConfirm'),
    toast: $('#toast')
  };

  function init() {
    dom.aiPrompt.value = RST.buildAIPrompt();
    bindEvents();
    const authenticated = isSessionActive();
    renderPreview(RST.loadContent());
    showAuthenticated(authenticated);
    if (authenticated) loadEditorDataFromBestSource({ quiet: true });
  }

  function bindEvents() {
    dom.loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const inputHash = await sha256(dom.adminPassword.value);
      const savedHash = localStorage.getItem(RST.ADMIN_HASH_KEY) || DEFAULT_ADMIN_HASH;
      if (inputHash === savedHash) {
        localStorage.setItem(RST.ADMIN_SESSION_KEY, JSON.stringify({ at: Date.now() }));
        dom.adminPassword.value = '';
        showAuthenticated(true);
        loadEditorDataFromBestSource({ quiet: false });
        toast('ログインしました。');
      } else {
        toast('パスワードが違います。');
        dom.adminPassword.select();
      }
    });

    dom.logoutButton.addEventListener('click', () => {
      localStorage.removeItem(RST.ADMIN_SESSION_KEY);
      showAuthenticated(false);
      toast('ログアウトしました。');
    });

    dom.importFile.addEventListener('change', () => {
      const file = dom.importFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        dom.jsonEditor.value = String(reader.result || '');
        validateEditor({ quiet: false });
      };
      reader.onerror = () => toast('ファイルを読み込めませんでした。');
      reader.readAsText(file, 'utf-8');
    });

    dom.validateButton.addEventListener('click', () => validateEditor({ quiet: false }));

    dom.loadSharedButton.addEventListener('click', () => {
      const ok = window.confirm('共有中の questions.json を読み直します。エディタの未保存内容は上書きされます。よろしいですか？');
      if (!ok) return;
      loadEditorDataFromBestSource({ quiet: false });
    });

    dom.saveButton.addEventListener('click', () => {
      const checked = RST.saveContent(dom.jsonEditor.value);
      if (!checked.ok) {
        showValidation(checked.errors, false);
        return;
      }
      dom.jsonEditor.value = JSON.stringify(checked.data, null, 2);
      renderPreview(checked.data);
      showValidation([
        `このブラウザに保存しました。${checked.data.lessons.length}コースを確認できます。`,
        'クラス全員に共有するには「共有用 questions.json をダウンロード」して、公開中の questions.json を置き換えてください。'
      ], true);
      toast('このブラウザに保存しました。共有するには questions.json を置き換えてください。');
    });

    dom.formatButton.addEventListener('click', () => {
      const checked = RST.validateContent(dom.jsonEditor.value);
      if (!checked.ok) {
        showValidation(checked.errors, false);
        return;
      }
      dom.jsonEditor.value = JSON.stringify(checked.data, null, 2);
      showValidation(['JSONを整形しました。'], true);
    });

    dom.resetButton.addEventListener('click', () => {
      const ok = window.confirm('初期データに戻します。現在保存している内容は消えます。よろしいですか？');
      if (!ok) return;
      const data = RST.resetContent();
      dom.jsonEditor.value = JSON.stringify(data, null, 2);
      renderPreview(data);
      showValidation(['初期データに戻しました。'], true);
      toast('初期データに戻しました。');
    });

    dom.shareExportButton.addEventListener('click', () => {
      const checked = RST.validateContent(dom.jsonEditor.value);
      if (!checked.ok) {
        showValidation(checked.errors, false);
        return;
      }
      const json = JSON.stringify(checked.data, null, 2);
      dom.jsonEditor.value = json;
      renderPreview(checked.data);
      downloadFile('questions.json', json, 'application/json');
      showValidation([
        '共有用 questions.json をダウンロードしました。',
        'GitHub Pagesで公開している同名ファイルを置き換えると、生徒の通常URLに反映されます。'
      ], true);
      toast('questions.json をダウンロードしました。');
    });

    dom.exportButton.addEventListener('click', () => {
      const data = RST.loadContent();
      const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      downloadFile(`romaji-star-typing-backup-${stamp}.json`, JSON.stringify(data, null, 2), 'application/json');
      toast('保存データのバックアップをダウンロードしました。');
    });

    dom.copyPromptButton.addEventListener('click', async () => {
      const copied = await copyText(dom.aiPrompt.value);
      if (copied) toast('外部AI用プロンプトをコピーしました。');
      else toast('コピーできませんでした。テキスト欄から手動でコピーしてください。');
    });

    dom.passwordForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const password = dom.newPassword.value;
      const confirm = dom.newPasswordConfirm.value;
      if (password.length < 4) {
        toast('パスワードは4文字以上にしてください。');
        return;
      }
      if (password !== confirm) {
        toast('確認用パスワードが一致しません。');
        dom.newPasswordConfirm.select();
        return;
      }
      localStorage.setItem(RST.ADMIN_HASH_KEY, await sha256(password));
      dom.newPassword.value = '';
      dom.newPasswordConfirm.value = '';
      toast('パスワードを変更しました。');
    });
  }

  async function loadEditorDataFromBestSource({ quiet }) {
    try {
      const data = await RST.loadSharedContent();
      dom.jsonEditor.value = JSON.stringify(data, null, 2);
      renderPreview(data);
      if (!quiet) showValidation(['共有中の questions.json を読み込みました。編集後、共有用 questions.json としてダウンロードできます。'], true);
    } catch (error) {
      const data = RST.loadContent();
      dom.jsonEditor.value = JSON.stringify(data, null, 2);
      renderPreview(data);
      const detail = error && error.message ? error.message : String(error);
      showValidation([
        '共有中の questions.json を読み込めなかったため、このブラウザの保存データまたは初期データを表示しています。',
        detail
      ], false);
    }
  }

  function refreshEditorFromStorage() {
    const data = RST.loadContent();
    dom.jsonEditor.value = JSON.stringify(data, null, 2);
    renderPreview(data);
  }

  function validateEditor({ quiet }) {
    const checked = RST.validateContent(dom.jsonEditor.value);
    if (checked.ok) {
      if (!quiet) showValidation([`OK：${checked.data.lessons.length}コース、合計${countWords(checked.data)}語を読み込めます。`], true);
      renderPreview(checked.data);
    } else {
      showValidation(checked.errors, false);
    }
    return checked;
  }

  function showValidation(messages, ok) {
    dom.validationResult.classList.toggle('is-ok', ok);
    dom.validationResult.classList.toggle('is-error', !ok);
    dom.validationResult.innerHTML = messages.map((message) => `<div>${escapeHtml(message)}</div>`).join('');
  }

  function renderPreview(data) {
    dom.contentPreview.innerHTML = '';
    const title = document.createElement('div');
    title.className = 'preview-card';
    title.innerHTML = `
      <h3>${escapeHtml(data.appTitle || 'タイトルなし')}</h3>
      <div class="preview-meta">
        <span>${escapeHtml(data.schema || '')}</span>
        <span>${data.lessons.length}コース</span>
        <span>${countWords(data)}語</span>
      </div>
      <p>${escapeHtml(data.appSubtitle || '')}</p>
    `;
    dom.contentPreview.appendChild(title);

    data.lessons.forEach((lesson) => {
      const sampleWords = (lesson.words || []).slice(0, 5).map((word) => word.text || word.kana).join(' / ');
      const card = document.createElement('div');
      card.className = 'preview-card';
      card.innerHTML = `
        <h3>${escapeHtml(lesson.title)}</h3>
        <div class="preview-meta">
          <span>${escapeHtml(lesson.difficulty || '★☆☆')}</span>
          <span>${lesson.timeLimit || 60}秒</span>
          <span>${(lesson.words || []).length}語</span>
        </div>
        <p>${escapeHtml(lesson.description || '')}</p>
        <p>例：${escapeHtml(sampleWords || 'なし')}</p>
      `;
      dom.contentPreview.appendChild(card);
    });
  }

  function countWords(data) {
    return (data.lessons || []).reduce((sum, lesson) => sum + ((lesson.words || []).length), 0);
  }

  function showAuthenticated(isAuthenticated) {
    dom.loginView.classList.toggle('hidden', isAuthenticated);
    dom.adminView.classList.toggle('is-active', isAuthenticated);
    if (isAuthenticated) {
      setTimeout(() => dom.jsonEditor.focus(), 60);
    } else {
      setTimeout(() => dom.adminPassword.focus(), 60);
    }
  }

  function isSessionActive() {
    const session = safeJson(localStorage.getItem(RST.ADMIN_SESSION_KEY));
    if (!session || !session.at) return false;
    const ageMs = Date.now() - Number(session.at);
    return ageMs >= 0 && ageMs < 1000 * 60 * 60 * 8;
  }

  async function sha256(message) {
    const bytes = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hashBuffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_error) {}
    }
    dom.aiPrompt.focus();
    dom.aiPrompt.select();
    try {
      return document.execCommand('copy');
    } catch (_error) {
      return false;
    }
  }

  function downloadFile(filename, text, mime) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function safeJson(value) {
    try {
      return JSON.parse(value);
    } catch (_error) {
      return null;
    }
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
    }[char]));
  }

  function toast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add('is-showing');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => dom.toast.classList.remove('is-showing'), 2800);
  }

  init();
})();
