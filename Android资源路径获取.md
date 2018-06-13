# Android资源路径获取

未标注的代表显示正常

```java
ImageView imageView = (ImageView) findViewById(R.id.image_view);
```

## assets

```java
imageView.setImageURI(Uri.parse("file:///android_asset/ic_launcher.png")); //图片无法显示
```

```java
try {
    InputStream is = getResources().getAssets().open("ic_launcher.png");
    imageView.setImageBitmap(BitmapFactory.decodeStream(is));
} catch (IOException e) {
    e.printStackTrace();
}
```

## drawable

```java
imageView.setImageURI(Uri.parse("android.resource://"+getPackageName()+"/"+R.drawable.ic_launcher));

imageView.setImageResource(getResources().getIdentifier("ic_launcher", "drawable", getPackageName()));

imageView.setImageDrawable(getResources().getDrawable(R.drawable.ic_launcher));
```

## mipmap

```java
imageView.setImageURI(Uri.parse("android.resource://"+getPackageName()+"/"+R.mipmap.ic_launcher));

imageView.setImageResource(getResources().getIdentifier("ic_launcher", "mipmap", getPackageName()));

imageView.setImageDrawable(getResources().getDrawable(R.mipmap.ic_launcher));
```

## raw

```java
imageView.setImageURI(Uri.parse("android.resource://"+getPackageName()+"/"+R.raw.ic_launcher));

imageView.setImageResource(getResources().getIdentifier("ic_launcher", "raw", getPackageName()));

imageView.setImageDrawable(getResources().getDrawable(R.raw.ic_launcher)); //不推荐，但是能显示

imageView.setImageBitmap(BitmapFactory.decodeStream(getResources().openRawResource(R.raw.ic_launcher)));
```
