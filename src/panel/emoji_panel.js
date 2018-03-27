function getEmoji() {
  return fetch('emoji.json')
    .then(response => response.json())
    .catch(error => console.error(error));
}

function onSearchTextChange(event) {
  const value = event.target.value.toLowerCase();
  let allHidden = true;

  document.querySelectorAll('.emojis').forEach(elem => {
    let hidden = true;
    // console.log('elem', elem, elem.childNodes[0]);

    elem.querySelectorAll('.emoji').forEach(child => {
      const description = child.getAttribute('title').toLowerCase();
      const tags = child.dataset.tags.toLowerCase().split(',');
      // console.log('description', description, 'value', value, 'tags', tags, tags.find(tag => tag.includes(value)));
      const childHidden = !!value && !description.includes(value) && !tags.find(tag => tag.includes(value));

      child.hidden = childHidden;
      if (!childHidden) { hidden = false; }
    });

    elem.parentElement.hidden = hidden;
    if (!hidden) { allHidden = false; }
  });
}

function onEmojiClick(event) {
  event.preventDefault();

  const pasteText = document.getElementById('paste-text');

  pasteText.value = this.innerHTML;
  pasteText.select();
  document.execCommand('copy');
}

function init() {
  getEmoji().then(emojiList => {
    const categories = [
      'People',
      'Nature',
      'Foods',
      'Activity',
      'Places',
      'Objects',
      'Symbols',
      'Flags'
    ];

    const markup = categories.map(category =>
      `<details open>
        <summary>${category}</summary>
        <div class="emojis">
          ${

            emojiList
              .filter(emojiSingle => emojiSingle.category && emojiSingle.category === category)
              .filter(emojiSingle => category === 'Flags' || emojiSingle.emoji.length <= 2)
              .map(emojiSingle =>
                `<a href="#" class="emoji" title="${emojiSingle.description}" data-tags="${emojiSingle.tags.join(',')}">${emojiSingle.emoji}</a>`
              ).join('')

          }
        </div>
      </details>`
    ).join('');
    const element = document.getElementById('emojis');

    element.innerHTML = markup;

    document.querySelector('input[type="search"]').oninput = onSearchTextChange;
    document.querySelectorAll('.emoji').forEach(elem => { elem.onclick = onEmojiClick });
  });
}

window.onload = () => {
  init();
}
