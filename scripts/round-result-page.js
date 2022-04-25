class RoundResultPage {
    constructor(element) {
        this.page = element.querySelector(':scope .round-result-page');
        this.lable_template = {
            element: element.querySelector(':scope .round-result-page__lable'),
            word: element.querySelector(':scope .round-result-page__word'),
            btn_get: element.querySelector(':scope .color-scheme__secondary'),
            btn_drop: element.querySelector(':scope .color-scheme__primary'),
        }
        this.lable_template.element.parentNode.removeChild(this.lable_template.element);
        this.lable_template.element.classList.remove('template');
    }

    add(word, is_get) {
        this.lable_template.word.textContent = word;
        this.lable_template.btn_get.disabled = is_get;
        this.lable_template.btn_drop.disabled = !is_get;
        this.page.appendChild(this.lable_template.element.cloneNode(true));
    }

    removeAll() {
        let children = this.page.children;
        while (children.length > 0)
            this.page.removeChild(children[0]);
    }
}
