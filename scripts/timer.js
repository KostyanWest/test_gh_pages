class Timer {
    constructor(element) {
        let spans = element.querySelectorAll(':scope span');
        this.minutes = spans[0];
        this.seconds = spans[2];
    }

    get time() {
        return Number(this.minutes.textContent) * 60 + Number(this.seconds.textContent);
    }

    set time(value) {
        if (value < 0)
            value = 0;
        this.minutes.textContent = Math.floor(value / 60);
        this.seconds.textContent = value % 60;
    }

    start(callback) {
        this.timer_id = setInterval(() => {
            if (--this.time === 0) {
                this.stop();
                callback();
            }
        }, 1000);
    }

    stop() {
        if (this.timer_id !== null) {
            clearInterval(this.timer_id);
            this.timer_id = null;
        }
    }
}
