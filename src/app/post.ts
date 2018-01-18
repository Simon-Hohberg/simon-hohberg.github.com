export class Post {

    private _title: string;
    private _summary: string;
    private _imgThumbUrl: string;
    private _content: string;
    private _layout: string;
    private _date: Date;
    private _keywords: Array<string>;
    private _thumbColor: string;

    constructor(title?: string, summary?: string, imgThumbUrl?: string, content?: string, layout?: string, date?: Date, keywords?: Array<string>, thumbColor?: string) {
        this._title = title;
        this._summary = summary;
        this._imgThumbUrl = imgThumbUrl;
        this._content = content;
        this._layout = layout;
        this._date = date;
        this._keywords = keywords;
        this._thumbColor = thumbColor;
    }

    set title(title: string) {
        this._title = title;
    }

    get title(): string {
        return this._title;
    }

    set summary(summary: string) {
        this._summary = summary;
    }

    get summary(): string {
        return this._summary;
    }

    set imgThumbUrl(imgThumbUrl: string) {
        this._imgThumbUrl = imgThumbUrl;
    }

    get imgThumbUrl(): string {
        return this._imgThumbUrl;
    }

    set content(content: string) {
        this._content = content;
    }

    get content(): string {
        return this._content;
    }

    set layout(layout: string) {
        this._layout = layout;
    }

    get layout(): string {
        return this._layout;
    }

    set date(date: Date) {
        this._date = date;
    }

    get date(): Date {
        return this._date;
    }

    set keywords(keywords: Array<string>) {
        this._keywords = keywords;
    }

    get keywords(): Array<string> {
        return this._keywords;
    }

    set thumbColor(thumbColor: string) {
        this._thumbColor = thumbColor;
    }

    get thumbColor(): string {
        return this._thumbColor;
    }
}
