import { AbstractDOMAdaptor } from '../core/DOMAdaptor.js';
import { LiteDocument } from './lite/Document.js';
import { LiteElement, LiteNode } from './lite/Element.js';
import { LiteText, LiteComment } from './lite/Text.js';
import { LiteWindow } from './lite/Window.js';
import { LiteParser } from './lite/Parser.js';
import { OptionList } from '../util/Options.js';
export declare class LiteAdaptor extends AbstractDOMAdaptor<LiteElement, LiteText, LiteDocument> {
    static OPTIONS: OptionList;
    static cjkPattern: RegExp;
    options: OptionList;
    document: LiteDocument;
    window: LiteWindow;
    parser: LiteParser;
    constructor(options?: OptionList);
    parse(text: string, format?: string): LiteDocument;
    protected create(kind: string, _ns?: string): LiteElement;
    text(text: string): LiteText;
    comment(text: string): LiteComment;
    createDocument(): LiteDocument;
    head(doc: LiteDocument): LiteElement;
    body(doc: LiteDocument): LiteElement;
    root(doc: LiteDocument): LiteElement;
    doctype(doc: LiteDocument): string;
    tags(node: LiteElement, name: string, ns?: string): LiteElement[];
    elementById(node: LiteElement, id: string): LiteElement;
    elementsByClass(node: LiteElement, name: string): LiteElement[];
    getElements(nodes: (string | LiteElement | LiteElement[])[], document: LiteDocument): LiteElement[];
    contains(container: LiteNode, node: LiteNode | LiteText): boolean;
    parent(node: LiteNode): LiteElement;
    childIndex(node: LiteNode): number;
    append(node: LiteElement, child: LiteNode): LiteNode;
    insert(nchild: LiteNode, ochild: LiteNode): void;
    remove(child: LiteNode): LiteNode;
    replace(nnode: LiteNode, onode: LiteNode): LiteNode;
    clone(node: LiteElement): LiteElement;
    split(node: LiteText, n: number): LiteText;
    next(node: LiteNode): LiteNode;
    previous(node: LiteNode): LiteNode;
    firstChild(node: LiteElement): LiteNode;
    lastChild(node: LiteElement): LiteNode;
    childNodes(node: LiteElement): LiteNode[];
    childNode(node: LiteElement, i: number): LiteNode;
    kind(node: LiteNode): string;
    value(node: LiteNode | LiteText): string;
    textContent(node: LiteElement): string;
    innerHTML(node: LiteElement): string;
    outerHTML(node: LiteElement): string;
    serializeXML(node: LiteElement): string;
    setAttribute(node: LiteElement, name: string, value: string | number, ns?: string): void;
    getAttribute(node: LiteElement, name: string): any;
    removeAttribute(node: LiteElement, name: string): void;
    hasAttribute(node: LiteElement, name: string): boolean;
    allAttributes(node: LiteElement): {
        name: string;
        value: string;
    }[];
    addClass(node: LiteElement, name: string): void;
    removeClass(node: LiteElement, name: string): void;
    hasClass(node: LiteElement, name: string): boolean;
    setStyle(node: LiteElement, name: string, value: string): void;
    getStyle(node: LiteElement, name: string): string;
    allStyles(node: LiteElement): any;
    fontSize(_node: LiteElement): any;
    fontFamily(_node: LiteElement): any;
    nodeSize(node: LiteElement, _em?: number, _local?: boolean): [number, number];
    nodeBBox(_node: LiteElement): {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
}
export declare function liteAdaptor(options?: OptionList): LiteAdaptor;
