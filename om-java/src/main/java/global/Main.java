package global;

import java.util.Collection;
import java.util.regex.Pattern;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.tools.shell.Global;

public class Main {
	public static void main(String[] args) throws Exception {
		System.out.println("Hello World!");
		System.out.println(Adder.Add2(11, 22));
		Pattern pattern;
		//pattern = Pattern.compile(".*");
		//pattern = Pattern.compile("org/.*");
		pattern = Pattern.compile(".*\\.txt");
		final Collection<String> list = ResourceList.getResources(pattern);
		for (final String name : list) {
			System.out.println(name);
		}
		System.out.println(ResourceUtil.GetString("dummy.txt").toString());
		rhino_test();
	}

	public static void rhino_test() {
	    Context context = Context.enter();
	    try {
	        // load、importPackage、print を使うために必要
	        Global global = new Global(context);
	        // スコープを初期化
	        ImporterTopLevel.init(context, global, true);
	       
	        //context.evaluateString(global, "console.log('hello rhino!')", "<eval>", 1, null);
	        context.evaluateString(global, "globalThis.xyz = 'xyz'", "<eval>", 1, null);
	        context.evaluateString(global, "print(xyz)", "<eval>", 1, null);

	        context.evaluateString(global, "globalThis.console = { log: print }", "<eval>", 1, null);
	        // JSファイルのロード
	        context.evaluateString(global, "load('index.js')", "<eval>", 1, null);
	        context.evaluateString(global, "print(add2(22, 33))", "<eval>", 1, null);

	        // JSファイルのロード
	        context.evaluateString(global, "load('JsFunctions.js')", "<eval>", 1, null);
	 
	        // パッケージのインポート
	        context.evaluateString(global, "importPackage(Packages.test.js)", "<eval>", 1, null);
	         
	        // スクリプトをコンパイル
	        Script compiledScript = context.compileString("print(sum(10,50))", "<eval>", 1, null);
	 
	        // グローバル変数を定義
	        context.evaluateString(global, "var gVal = 0", "eval", 1, null);
	 
	        JavaClass jClass = new JavaClass("rhino");
	        for (int i = 0; i < 10; i++) {
	            // 評価用のスコープを用意（グローバルスコープを引数に渡してグローバルオブジェクトを共有する）
	            Scriptable scope = context.initStandardObjects(global);
	             
	            // グローバル変数を出力後、カウントアップ
	            context.evaluateString(scope, "print('グローバル変数 gVal=' + gVal++)", "<eval>", 1, null);
	             
	            // Javaのクラスを使用するfunctionを定義
	            context.evaluateString(scope, "function sum() { return JavaFunctions.sum(Array.prototype.slice.call(arguments)); }", "<eval>", 1, null);
	             
	            // 内部でJavaのクラスを使用
	            context.evaluateString(scope, "print(sum(1,5));", "<eval>", 1, null);
	             
	            // Javaから受け渡されたデータ、オブジェクトを使用
	            ScriptableObject.putProperty(scope, "count", i * 10);
	            ScriptableObject.putProperty(scope, "str", "creator");
	            ScriptableObject.putProperty(scope, "jClass", jClass);
	            // 受け渡されたデータをJavaのクラスに設定
	            context.evaluateString(scope, "jClass.setCount(count)", "<eval>", 1, null);
	            // 1.7.13 ではテンプレートリテラルの変数が展開されない
	            //context.evaluateString(scope, "jClass.println(`str=${str}`)", "<eval>", 1, null); 
	            context.evaluateString(scope, "jClass.println('str=' + str)", "<eval>", 1, null); 
	 
	            // ロードしたJSファイルの無名関数を使用
	            context.evaluateString(scope, "print(joiner('Doc', 'Creator', 4))", "<eval>", 1, null);
	             
	            // 事前にコンパイルしたスクリプトを実行
	            compiledScript.exec(context, scope);
	        }
	         
	    } finally {
	        Context.exit();
	    }
	}

}
