function getRandomCssColor() {
    const h = Math.random();
    const r = Math.max(Math.min(Math.abs(h * 6 - 3) - 1, 1), 0) * 217;
    const g = Math.max(Math.min(2 - Math.abs(h * 6 - 2), 1), 0) * 217;
    const b = Math.max(Math.min(2 - Math.abs(h * 6 - 4), 1), 0) * 217;
    const digits = '0123456789abcdef';
    let color = '#';
    color += digits[Math.floor(r / 16)];
    color += digits[Math.floor(r % 16)];
    color += digits[Math.floor(g / 16)];
    color += digits[Math.floor(g % 16)];
    color += digits[Math.floor(b / 16)];
    color += digits[Math.floor(b % 16)];
    return color;
}

class RoundPageDeck {
    constructor(element) {
        this.deck = element;
        this.card_template = element.querySelector(':scope .round-page-deck__card');
        this.card_template.parentNode.removeChild(this.card_template);
        this.card_template.classList.add('round-page-deck__card_hidden_deck');
        this.card_template.classList.remove('template');
    }

    add() {
        let newCard = this.card_template.cloneNode(true);
        newCard.style.setProperty('--local-rotate', 'rotate(' + (Math.random() * 40 - 20) + 'deg)');
        newCard.style.setProperty('--local-color', getRandomCssColor());
        this.deck.insertBefore(newCard, this.deck.firstElementChild);
        setTimeout(() => { newCard.classList.remove('round-page-deck__card_hidden_deck'); });
    }

    top() {
        return this.deck.lastElementChild;
    }

    pop() {
        let card = this.top();
        this.deck.removeChild(card);
        return card;
    }

    removeAll() {
        let children = this.deck.children;
        while (children.length > 0)
            this.deck.removeChild(children[0]);
    }

    makeGrabbableCard(card) {
        const deck = this.deck;
        const rect = card.getBoundingClientRect();
        const card_base = window.scrollY + rect.top;
        const card_height = rect.height;
        let grab_offset = 0;
        let is_over_get_area = false;
        let is_over_drop_area = false;

        function move(event) {
            const move_offset = window.scrollY + event.clientY - card_base - grab_offset;
            card.style.top = Math.min(Math.max(move_offset, -card_height), card_height) + 'px';
            const is_over_get_area_now = (move_offset <= -card_height / 2);
            if (is_over_get_area_now !== is_over_get_area) {
                is_over_get_area = is_over_get_area_now;
                deck.dispatchEvent(new CustomEvent('cardArea', {
                    detail: {
                        card: card,
                        area: 'get',
                        action: is_over_get_area_now ? 'enter' : 'leave'
                    }
                }));
            }
            const is_over_drop_area_now = (move_offset >= card_height / 2);
            if (is_over_drop_area_now !== is_over_drop_area) {
                is_over_drop_area = is_over_drop_area_now;
                deck.dispatchEvent(new CustomEvent('cardArea', {
                    detail: {
                        card: card,
                        area: 'drop',
                        action: is_over_drop_area_now ? 'enter' : 'leave'
                    }
                }));
            }
        }

        function drop(event) {
            card.classList.remove('round-page-deck__card_grabbing');
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', drop);
            card.style.top = '';
            if (is_over_get_area)
                card.classList.add('round-page-deck__card_hidden_get');
            if (is_over_drop_area)
                card.classList.add('round-page-deck__card_hidden_drop');
            if (is_over_get_area || is_over_drop_area) {
                card.onmousedown = null;
                setTimeout(() => {
                    card.parentNode.removeChild(card);
                    deck.dispatchEvent(new CustomEvent('cardRemove', { detail: { card: card } }));
                }, 200);
                deck.dispatchEvent(new CustomEvent('cardArea', {
                    detail: {
                        card: card,
                        area: is_over_get_area ? 'get' : is_over_drop_area ? 'drop' : 'none',
                        action: 'leave'
                    }
                }));
            }
            deck.dispatchEvent(new CustomEvent('cardDrop', {
                detail: {
                    card: card,
                    area: is_over_get_area ? 'get' : is_over_drop_area ? 'drop' : 'none'
                }
            }));
            is_over_get_area = false;
            is_over_drop_area = false;
        }

        function grab(event) {
            grab_offset = window.scrollY + event.clientY - card_base;
            card.classList.add('round-page-deck__card_grabbing');
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', drop);
            deck.dispatchEvent(new CustomEvent('cardGrab', { detail: { card: card } }));
        }

        card.classList.add('round-page-deck__card_grabbable');
        card.onmousedown = grab;
    }
}
