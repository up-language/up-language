globalThis.User = class {
    constructor( name, age ) {
        this.name = name;
        this.age = age;
    }
    //ゲッターメソッド
    get myName() {
        return this.name;
    }
}

var taro = new User('太郎', 32);
console.log( taro.myName );
