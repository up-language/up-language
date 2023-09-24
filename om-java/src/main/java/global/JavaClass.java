package global;

public class JavaClass {
    private String pre;
    private int count = 0;
     
    public JavaClass(String s) {
        pre = s;
    }
     
    public int getCount() {
        return count;
    }
    public void setCount(int count) {
        this.count = count;
    }
 
    public void println(Object arg) {
        System.out.println(pre + "です。count=" + count + ", " + String.valueOf(arg));
    }
}
