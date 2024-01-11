export class RawBuilder {

    #data = [];

    /**
     * @param {string} data 
     * @returns {RawBuilder}
     */
    setTranslate(data) {
        this.#data.push({translate: data})
        return this;
    }

    /**
     * @param {string} data 
     * @returns {RawBuilder} 
     */
    setText(data, nextline = true) {
        if(nextline) {
            this.#data.push({text: data + "\n"});
        } else {
            this.#data.push({text: data});
        }
        return this;
    }

    /**
     * @param {Array} data 
     * @returns {RawBuilder} 
     */
    addJson(data){
        for (let i = 0; i < data.length; i++) {
            const json = data[i];
            this.#data.push(json)   
        }
        return this;
    }

    /**
     * @returns {Object}
     */
    getData() {
        return this.#data;
    }

    /**
     * @returns {Object}
     */
    getJson() {
        return { rawtext: this.#data };
    }
}


export class TextBuilder {

    #STRINGS = "";

    setText(text, nextline = true) {
        if(nextline) {
            this.#STRINGS = this.#STRINGS + text + "\n";
        } else {
            this.#STRINGS = this.#STRINGS + text;
        }
        return this;
    }

    getText() {
        return this.#STRINGS;
    }
}