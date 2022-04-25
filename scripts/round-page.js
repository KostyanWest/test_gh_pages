class RoundPage {
    constructor(element) {
        this.timer = new Timer(element.querySelector(':scope .round-page__timer'));
        this.counter_get = element.querySelector(':scope .round-page__counter_type_get');
        this.counter_drop = element.querySelector(':scope .round-page__counter_type_drop');
        this.hint_get = element.querySelector(':scope .round-page__hint_hidden_get');
        this.hint_drop = element.querySelector(':scope .round-page__hint_hidden_drop');
        this.deck = new RoundPageDeck(element.querySelector(':scope .round-page-deck'));
        this.result_page = new RoundResultPage(document.getElementById('round_result_page'));
        this.deck.deck.addEventListener('cardGrab', () => {
            this.hint_get.classList.remove('round-page__hint_hidden_get');
            this.hint_drop.classList.remove('round-page__hint_hidden_drop');
        });
        this.deck.deck.addEventListener('cardDrop', (event) => {
            this.hint_get.classList.add('round-page__hint_hidden_get');
            this.hint_drop.classList.add('round-page__hint_hidden_drop');
            if (!this.is_playing) {
                if (event.detail.area != 'none')
                    this.begin();
            }
            else if (event.detail.area == 'get') {
                this.counter_get.textContent = '+' + ++this.counter_get.textContent;
                this.counter_get.classList.add('round-page__counter_gain');
                setTimeout(() => { this.counter_get.classList.remove('round-page__counter_gain'); }, 100);
                this.result_page.add(event.detail.card.textContent, true);
            }
            else if (event.detail.area == 'drop') {
                this.counter_drop.textContent = --this.counter_drop.textContent;
                this.counter_drop.classList.add('round-page__counter_gain');
                setTimeout(() => { this.counter_drop.classList.remove('round-page__counter_gain'); }, 100);
                this.result_page.add(event.detail.card.textContent, false);
            }
        });
        this.deck.deck.addEventListener('cardArea', (event) => {
            if (event.detail.area == 'get') {
                if (event.detail.action == 'enter')
                    this.hint_get.classList.add('round-page__hint_excited');
                else
                    this.hint_get.classList.remove('round-page__hint_excited');
            }
            else {
                if (event.detail.action == 'enter')
                    this.hint_drop.classList.add('round-page__hint_excited');
                else
                    this.hint_drop.classList.remove('round-page__hint_excited');
            }
        });
        this.deck.deck.addEventListener('cardRemove', (event) => {
            /* TODO && this.is_gaming */
            this.nextWord();
        });
        this.promise_await = null;
        this.promise_current = null;
        this.is_playing = false;
    }

    init(team, rules, words) {
        this.team = team;
        this.rules = rules;
        this.words = new Set(['Lol', 'Kek', 'Cheburek']);
        this.timer.time = 10;
        //this.timer.time = this.rules.round_time;
        this.counter_get.textContent = '+0';
        this.counter_drop.textContent = '-0';
        this.hint_get.textContent = 'Сдвинь вверх, чтобы начать';
        this.hint_drop.textContent = 'Сдвинь вниз, чтобы начать';
        this.deck.removeAll();
        for (let i = 0; i < 4; ++i) {
            this.deck.add();
        }
        this.deck.top().textContent = 'Сдвинь, чтобы начать';
        this.result_page.removeAll();
        this.nextWord();
    }

    // TODO
    show() {
        this.style.display = '';
        this.classList.remove('page_hidden');
    }

    // TODO
    hide() {
        this.style.display = 'none';
        this.classList.remove('page_hidden');
    }

    begin() {
        this.is_playing = true;
        this.timer.start(() => { this.end(); });
        setTimeout(() => {
            this.hint_get.textContent = 'Отгадали';
            this.hint_drop.textContent = 'Пропустили';
        }, 100);
    }

    end() {
        this.is_playing = false;
        this.timer.stop();

    }

    async asyncNextWord() {
        if (this.promise_await !== null) {
            this.deck.top().textContent = await this.promise_await;
            this.deck.add();
        }
        this.deck.makeGrabbableCard(this.deck.top());
        const rand = Math.floor(Math.random() * this.words.size);
        const iter = this.words.values();
        for (let i = 0; i < rand; ++i)
            iter.next();
        const word = iter.next().value;
        this.words.delete(word)
        return word;
    }

    nextWord() {
        this.promise_await = this.promise_current;
        this.promise_current = this.asyncNextWord();
    }
}
