package com.fqxyi.socialcomponent;

/**
 * 参考文章：
 * https://blog.csdn.net/justloveyou_/article/details/78298420
 * </p>
 * 使用场景：
 * 对象属性繁多，一般都具有5个或者5个以上的属性，特别是大多数参数都是可选的时候
 * </p>
 * 内涵：
 * 不直接生成想要的对象，而是让客户端利用 所有必要的参数 构造一个Builder对象，
 * 然后在此基础上，调用类似于Setter的方法来设置每个可选参数，最后通过调用无参的build()方法来生成不可变对象。
 * 一般地，所属Builder是它所构建类的静态成员类。
 * </p>
 * 使用方式：
 * Person.Builder builder = new Person.Builder("rico", "boy", "rico@tju.edu.cn");
 * Person person = builder.height(173).addr("天津市").nickName("书呆子").build();
 * </p>
 * 特点：
 * Person类的构造方法是私有的: 也就是说，客户端不能直接创建User对象；
 * Person类是不可变的: 所有的属性都被final修饰，在构造方法中设置参数值，并且不对外提供setters方法;
 * Builder模式的高可读性：Builder模式使用了链式调用，可读性更佳。
 * Builder对象与目标对象的异同：Person与Builder拥有共同的属性，并且Builder内部类构造方法中只接收必传的参数，同时只有这些必传的参数使用了final修饰符。
 * </p>
 * Builder模式中的参数约束与线程安全性：
 * 我们知道，Person对象是不可变的，因此是线程安全的；但是，Builder对象并不具有线程安全性。
 * 因此，当我们需要对Person对象的参数强加约束条件时，我们应该可以对builder()方法中所创建出来的Person对象进行检验，即我们可以将builder()方法进行如下重写：
 * </p>
 * public Person build() {
 *     Person person = new Person(this);
 *     if (!"boy".equals(person.sex)) {
 *         throw new IllegalArgumentException("所注册用户必须为男性！");
 *     } else {
 *         return person;
 *     }
 * }
 */
public class Person {
    private final String name;    // required
    private final String sex;     // required
    private final String email;   // required

    private final int height;     // optional
    private final String edu;     // optional
    private final String nickName;// optional
    private final int weight;     // optional
    private final String addr;    // optional

    // 私有构造器，因此Person对象的创建必须依赖于Builder
    private Person(Builder builder) {
        this.name = builder.name;
        this.sex = builder.sex;
        this.email = builder.email;
        this.height = builder.height;
        this.edu = builder.edu;
        this.nickName = builder.nickName;
        this.weight = builder.weight;
        this.addr = builder.addr;
    }

    public static class Builder {
        private final String name;    // required，使用final修饰
        private final String sex;     // required，使用final修饰
        private final String email;   // required，使用final修饰

        private int height;     // optional，不使用final修饰
        private String edu;     // optional，不使用final修饰
        private String nickName;// optional，不使用final修饰
        private int weight;     // optional，不使用final修饰
        private String addr;    // optional，不使用final修饰

        public Builder(String name, String sex, String email) {
            this.name = name;
            this.sex = sex;
            this.email = email;
        }

        // 返回Builder对象本身，链式调用
        public Builder height(int height) {
            this.height = height;
            return this;
        }

        // 返回Builder对象本身，链式调用
        public Builder edu(String edu) {
            this.edu = edu;
            return this;
        }

        // 返回Builder对象本身，链式调用
        public Builder nickName(String nickName) {
            this.nickName = nickName;
            return this;
        }

        // 返回Builder对象本身，链式调用
        public Builder weight(int weight) {
            this.weight = weight;
            return this;
        }

        // 返回Builder对象本身，链式调用
        public Builder addr(String addr) {
            this.addr = addr;
            return this;
        }

        // 通过Builder构建所需Person对象，并且每次都产生新的Person对象
        public Person build() {
            return new Person(this);
        }
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", sex='" + sex + '\'' +
                ", email='" + email + '\'' +
                ", height=" + height +
                ", edu='" + edu + '\'' +
                ", nickName='" + nickName + '\'' +
                ", weight=" + weight +
                ", addr='" + addr + '\'' +
                '}';
    }
}
