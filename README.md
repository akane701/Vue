# Vue
Docker使わないときは、手順としては1→5（の一部）のみでOK!<br>
5.1はすでに最低限のモジュールはインポートしてるので、`vue create`だけでOK。追加するモジュールがあれば適宜追加する感じ。<br>
（プロジェクトディレクトリにモジュールインストールしたい場合は-g無しでインストール）<br>
5.2はもともと多分-gで入れてないので、プロジェクトディレクトリで`npm init`、モジュールインポートどちらも行う。<br>

1. ディレクトリ作成
2. Dockerfile作成
    - 済み
3. docker-compose.yaml作成
    - 済み
4. コンテナ作成
    - `docker-compose build`
5. 必要なモジュールインストール、プロジェクト作成
    - `docker-compose exec -it <NAME> /bin/bash`で入る
    - 手順3でボリュームマウントしてる<br>
    1. Vue.js
        - モジュールインポート
            - `npm install -g @vue/cli @vue/cli-init`
        - プロジェクト作成
            - `vue create <プロジェクト名>`
        - 動作確認
            - `npm run serve`<br>
    2. Node.js + express
        - `npm init`で「package.json」作成
        - モジュールインポート
            - `npm install express cors`
            - `npm install nodemon`
        - 「index.js」ファイル作成
            - 参考：https://reffect.co.jp/vue/vue-js-database#i-15
        - 動作確認
            - `npx nodemon index.js`
6. 立ち上げ
    - `docker-compose up -d`
    - `docker-compose up`の方がエラー見えてデバッグしやすいので推奨。（webアプリ開発時の話。）
    - `-d`をつけると、ブラウザの検証からしか見えなくてデバッグしづらい。特にバックエンドのほう。
7. 削除
    - `docker-compose down`
0. TIPS
    - 片方だけ動かしたいとき
        - `docker run -it -d --name <NAME> -p (PORT):(PORT) -v (LOCAL):/usr/src/app(一例) <IMAGE_NAME>`
    - ログ
        - `docker-compose logs <NAME>`
    - バージョン確認
        - Vue.js 
            - プロジェクトディレクトリにインストールしたVue.jsのバージョン
                - npm list vue
            - グローバルにインストールしたVue.jsのバージョン
                - npm list -g vue
            - CDNでファイル読み込み
                - ブラウザ→検証から確認可能
        - vue-cli（Vue.jsのプロジェクトを簡単に立ち上げるためのパッケージ）
            - vue -v
    - npmのプロキシ設定
        - https://qiita.com/LightSpeedC/items/b273735e909bd381bcf1
        - 設定の削除`npm config delete proxy`
        - 設定の確認`npm config get proxy`

## TIPS
### Vue
- componentつくるとき
    - <script setup> [処理] </script>
    - もしくは
    - <script> export default { deta:() => ({ count:0, }), methods: {fun: function(){  }} } </script>
- 読み込み時に関数を実行したい
    - <script>(のexpose default)内でmounted() { 処理... }
    - 離脱時に実行したい場合はunmounted()
- Vueインスタンス内の記述
    - methodsで定義した関数の中で、dataの値を使いたいときはthisを使用
    - テンプレート構文内でプロパティにアクセスする場合は不要
- Vueインスタンスのデータ定義
    - アロー関数で定義すると、戻り値としてオブジェクトを返す。関数であれば、実行するたびに新しいオブジェクトが返ってくるが、仮にオブジェクトをそのまま記述した場合は、dataプロパティを通してアクセスされるオブジェクトは常に一緒になるので、Vueでは関数でオブジェクトを返すような実装にすると、複数個所で独立した同一変数が使用できる。
- Vueインスタンスのmethods
    - 引数(event)を指定すると、イベントオブジェクトを取得することができる
        - イベントオブジェクト：イベントにかかわる情報を管理するためのオブジェクトでJavaScriptによって自動生成される。
        - 複数引数を渡す場合は、呼び出し元、呼び出し先両方で$eventと明示的に引数に記載する必要がある
        - （引数無しの場合は、呼び出されるほうでeventを引数に書くだけでok）
    - event.target
        - クリックした要素の取得
    - event.target.tagName
        - HTMLのタグ名を取得できる
    - event.target.innerHTML
        - コンテンツの部分(ボタンのクリック部分など)が習得できる
    - event.target.type
        - イベントタイプ(submitなど)を取得できる
    - event.target.id
        - buttonにid=""をhtml側で設定すると、押されたボタンのidを取得できる。
#### ディレクティブ
- v-on(@で代用可能)
    - htmlタグと一緒に使用して、発火させる。また、発火タイミングを制御できる。
    - 代表的なものはclick(buttonタグに使用)だが、それ以外も設定できる。（[参考](https://teratail.com/questions/314581)）
    - changeは値が変化し、入力が確定したタイミングで発火。inputは入力したタイミングで発火する。（inputタグ、checkboxタグなど様々なタグで使える。）
        - `v-on:click="[function]"` 
        - `v-on:change="[function]"`
        - `v-on:input="[function]"`
- v-model
    - 双方向バインディング
    - ブラウザ上でデータを変化させるとVue（のJSで定義したプロパティの）のデータもともに変化する。(フォームの入力値をデータと同期させることが可能)
        - 例：`<input type="text" v-model="message">`
        - 例：`<input type="checkbox" v-model="task.completed" @change="updateTask(task.id, task.completed)"/>`
    - inputタグの中のvalue=という属性で指定して、v-modelで配列のオブジェクトと紐づくようにしてあげれば、自動で配列の中にそのvalueの値が格納される。はずしたらもちろん削除される。
        - `<input type="checkbox" id="red" value="Red" v-model="colors">Red <input type="checkbox" id="green" value="Green" v-model="colors">Green`
    - .lazy：バインドのタイミングを遅延させる
    - .trim：入力値からデータの前後の空白を削除してデータに代入する。
    - .number：入力値を数値型に型変換してからデータに代入
- v-bind:class
    - クラスをタグ内の記述で指定できる
    - 動的にクラスを変更可能
    - 例：`<span class="bg-gray text-blue" v-bind:class="{ large: isLarge, 'text-danger': hasError }"> Vue.js! </span>`
    - 省略記法`<a v-bind:href="url">`→`<a :href="url">`
- {{  }}
    - 変数を表示
    - 単一式ならJS式も利用可能
        - `<p>{{ ok ? `YES` : `NO` }}</p>`など
- v-cloak
    - ページを表示開始してからインスタンスの作成までに、マスタッシュタグなどのコンパイル前のテンプレートが表示されてエンドユーザに見られてしまうのを防ぎたい場合に使用
- v-once
    - 一度だけ動的バインディングを行う（1回のみ実行される）
    - 例：`<p v-once>{{ message }}</p>`
    - .onceはv-onディレクティブの修飾子。イベントハンドラを一回だけ実行する。
    - 例：`<button v-on:click.once="getTime">Get Time</button>   <p>{{ time }}</p>`
- v-show
    - 要素のdisplay CSSプロパティを切り替えることで表示、非表示を切り替える。
    - v-ifとの違い
        - 高い初期描画コスト
        - 表示・非表示を多く繰り返す場合に利用するのがよい
- v-if, v-else
    - 真偽値により要素の表示と非表示を切り替えることができる。
    - v-showとの違い
        - 要素をDOMから削除・追加するため、切り替えコストが高い。
        - 実行時に条件を変更することがほとんどない場合に利用するのがよい
- watch
    - 値の監視を行う。監視プロパティ。Vueインスタンスにmethodsと同じ感じで定義する。
    - 特定のデータまたは、算出プロパティの状態を監視して、変化があったときに登録した処理を自動的に実行できる
    - プロパティとして変数を、値として関数（第一引数は新しい値、第二引数に古い値をとることができる）として中に行いたい処理を記載する。
    - 監視プロパティのオプション-deep-, ネストされたオブジェクトも監視可能(true)
        - 基本、監視するプロパティがネストしている場合、深い部分の値の変更は監視されない。
- computed
    - 算出プロパティ。関数によって算出したデータを返すことができるプロパティ。
    - メソッドとの違い：プロパティなのでテンプレートで呼ぶときに()が不要。キャッシュ有り、中のデータが変化しない限り再度関数を実行しない。
    - 特に複雑なロジックを実行する時や、ロジックの再利用性を高めたいときは算出プロパティの利用が推奨される。
    - 算出プロパティ、監視プロパティどちらでも実装できる場合、基本的には算出プロパティの利用を推奨。
- コンポーネント
    - コンポーネント：ページを構成するUI部品。再利用可能なVueインスタンス。
        - コンポーネントは、HTMLベースのテンプレートとJavaScriptで書かれたロジックで構成されている。
        - コンポーネントは設計図で、設計図をもとに複数の実体を作成することができる。設計図から作成された実体はインスタンスという。
    - コンポーネントを定義するには、vueインスタンス.componentメソッドを利用する。
    - コンポーネント名は、ハイフン(-)を一つ以上含むケバブケースを利用する必要がある。
    - コンポーネントの中でcountを定義しているので、いちいち別に変数作成して、ボタンのidに応じて変化する変数を変える、なんてこともしなくてよい。
    - コンポーネントを作成するたびに新しいインスタンスが作成されるため、それぞれcountの値が独自で保持されている。
    - 特定のVueインスタンスのcomponentsオプションに登録することでローカル登録になる。
        - 登録したVueインスタンス配下でのみ利用できるようになる。
        - ここではローカル登録するだけ。「このコンポーネントを使う権利があります」というイメージ

### JS
- `<配列>.splice(index, 1)`でindexの位置から1つ削除

### Node.js
- Node.js側でVueみたいに動的にhtmlを生成したい場合は、ejsのようなテンプレートなるものが必要
    - 必要であればモジュールをインポート：`npm install ejs`
    - express側でejsを使うという記述も必要：`app.set("view engine", "ejs");`
- ejsで作成したテンプレートエンジン（html）(ファイルは~.ejs)を返したい場合
    - app.getの処理にres.render("./<ejs_file>")を記述すればよい。（app.useでもいける。）
    - **注意点**：res.renderで指定するファイルは「views」というファイルからの相対パスを指定する。
        - おそらく、viewsというファイル名は既定の名前とおもわれる。ので、これ以外の名前にしたら動かなくなるかも。
    - おおもとのejsファイルに埋め込む形でほかのejsファイルを実装
        - 入れ込むときは`<%- include(<現在のファイル空の相対パス>) %>`として動的にhtmlを生成する。
- ejsファイルでほかのejsファイルを使いたいときは<%- include()>を使えばできる。
- 静的ファイル配信(**必ずapp.useで使用**)
    - expressを使用
        - `express.static(<route>[, options])`
        - `<route>`は静的ファイルが配置してあるフォルダ
        - 戻り値はexpressのミドルウェア
        - `app.use("/dir1(例)", express.static(<route>))`の形で記載
            - `app.get`にしたら戻り値つけてもエラーになるので注意！
- favicon配信したかったら`npm install serve-favicon`でモジュールDLする必要あり
- fetchのmethodによりexpressで使用するメソッドが変わる
    - get（データ取得など）ならapp.get
    - post（値を格納など）ならapp.post
    - put(値の更新など)ならapp.put
    - delete(データ削除など)ならapp.delete

#### サーバーへデータを転送
- パスパラメータ
    - URLの中に埋め込む
    - 受け取る側：`app.get("/shops/:id", (rew, res) => {const id = req.params.id; ...}`
    - 渡す側：`await fetch('http://~/shops/' + id, { method: 'PUT',...`
- クエリパラメータ
    - URLの末尾に`search?keyword=xxxx`というものをつけて送る
    - 受け取る側でrequest.query.keywordでとりだせる。
    - `app.get("/serch", (req, res) => { keyword = req.query })`
- fetchのbodyの中に入れて値を渡す
    - `await fetch('http://~/task', {method: 'POST', body: JSON.stringify({task: task.value, completed: false}),`
    - 受け取る側で`req.body`として取り出せる。


#### 静的解析ツール
ソースコード上の問題をプログラム実行せずに検知する。

インストールする際に依存関係解決できてないと怒られた。
結論：npm i -D eslint@latestで解決
https://qiita.com/M-ISO/items/d693ac892549fc95c14c#npm-warn-unmet-dependency--unmet-peer-dependency
https://zenn.dev/ikuraikura/articles/71b917ab11ae690e3cd7

### HTML
- メタタグ
- header
- footer


### MYSQL
[コマンド参考](https://qiita.com/CyberMergina/items/f889519e6be19c46f5f4)
- ログイン
    - localhostの場合
        - `mysql -u <USER_NAME> -p`
    - 外部サーバ
        - `mysql -u <USER_NAME> -p -h <HOST_NAME> -P <PORT No.>`
- ログアウト
    - `exit`, `quit`
- 取得
    - `SELECT <NAME> FROM <TABLE_NAME>`
- TABLE
    - 作成
        - `CREATE TABLE <TABLE_NAME> <field_name> <deta_type> <option>`
    - 削除
        - `DROP TABLE <TABLE_NAME>`
    カラム追加
        - `ALTER TABLE <TABLE_NAME> ADD <追加カラム名> <型>`
    - テーブル設計確認
        - `desc <TABLE_NAME>`
- テーブル内のデータ（レコード）操作
    - 追加
        - `INSERT INTO <TABLE_NAME> <FIELD_NAME> VALUES <VALUE>`
    - 更新
        - `UPDATE <TABLE_NAME> SET <FIELD_NAME>=<VALUE> WHERE <条件式>`
    - 削除
        - `DELETE FROM <TABLE_NAME> (WHERE <条件式>)`

### GitHub
#### クローンしない場合
- ローカルリポジトリ作成される
    - git init
- リモートリポジトリを新規追加
    - git remote add origin https://~~
#### クローンする場合
- git clone <リポジトリ名>（https://~など）
    - クローン元のリモートリポジトリをoriginというショートカットでgit側が割り当てているので、push originでいける。
#### リモートリポジトリに追加
- git add 
- git commit -m "<COMMENT>"
- git push origin(<REMOTE_NAME>) <BRUNCH_NAME>
#### リモートリポジトリから取得
- git fetch <リモート名>
    - ローカルリポジトリ（remotes/リモート名/ブランチ）（リモート専用の場所）に情報を取得（別のブランチに保存される）
    - 反映させたい場合は、git merge <ブランチ名>を使って統合する
- git pull <リモート名> <ブランチ名>
    - masterにいる状態(ほかにhogeブランチが存在)でgit pull origin hogeを実行すると、masterにhogeがmergeされてしまうので注意
#### branch
- ブランチを新規追加
    - git branch <ブランチ名>
- ブランチの一覧を表示
    - git branch (-a:remoteリポジトリも表示)
- ブランチの切り替え
    - git checkout <既存ブランチ名>
    - HEADが示すブランチを切り替えている
- 過去のコミットからブランチ切りたいとき
    - git checkout -b <new_branch> <commit_hash>
#### ファイル変更など
- 変更したファイルの確認
    - git status
- 変更差分確認
    - git diff <ファイル名>
- 変更履歴の確認
    - git log (--oneline)
- ファイルへの変更を取り消す
    - git checkout --<ファイル名>, git checkout --<ディレクトリ名>
- ほかの人の変更作業を自分のブランチに取り込む
- git merge <ブランチ名>, git merge <リモート名/ブランチ名>
- コミットをきれいに整えてからpushしたいときは履歴を書き換える
    - 直前のコミットをやり直す(やり直す前のコミット記録は残らない)
        - git commit --amend
- 複数のコミットをやり直す場合
    - git rebase -i <コミットID>    (例：git rebase -i HEAD~3）  
        - 最新のコミットがHEAD
    - やり直したいコミットをeditに修正
    - やり直したらgit commit --amendで実行
    - git rebase --continue
        - rebase -iコマンドの一連の流れ
            - 以下はHEAD\~3を指定した場合。HEAD3を基点としてその子コミットから修正可能<br>
            HEAD\~3<br>
            HEAD\~2 edit<br>
            HEAD\~1 pick<br>
            HEAD pick<br>
            1. git rebase -iで対話的リベースモードに入る
            2. 修正したいコミットをeditにする
            3. editのコミットのところでコミットの適用が止まる
            4. git commit --amendコマンドで修正
            5. git rebase --continueで次のコミットへ
            6. pickだとそのままのコミット内容を適用して次へ進む
- コミットをまとめる場合
    - git rebase -i HEAD~3
    - pick -> squashにすると、そのコミットを直前のコミットとまとめて一つにする
- コミットを分割する場合
    - 分割したいコミットをpick -> editにする

#### 環境構築参考サイト
[参考サイト]<br>
[dockerでVue環境を構築](https://zenn.dev/rihito/articles/30deafe567a564)<br>
[create-vueでVueプロジェクトを作成してみる](https://zenn.dev/kyrice2525/articles/d0024393071aee)<br>
[WLS2 の Docker コンテナ内の Laravel9.2 Vite SPA 。 `npm run dev` 時に Docker ホストのウェブブラウザからコンテナ内の Vite 開発サーバに繋がるようにした記録](https://oki2a24.com/2022/08/28/connect-vite-dev-server-at-npm-run-dev-in-wls2-docker-laravel9-2-vite-spa/)<br>
[docker-compose.ymlのbuild設定はとりあえずcontextもdockerfileも埋めとけって話](https://qiita.com/sam8helloworld/items/e7fffa9afc82aea68a7a)<br>


#### Webアプリ作成参考サイト
webアプリ作成参考サイト<br>
[Vue3のリアクティブシステムを理解する(前編)](https://maasaablog.com/development/frontend/javascript/vue/4950/)<br>
[Vue.jsの双方向バインディング再入門](https://qiita.com/fruitriin/items/dc75af413da3661f9e78)<br>
[【Vue.js 3.2】`<script setup>` 構文がすごくすごい](https://zenn.dev/azukiazusa/articles/676d88675e4e74)<br>
[Node.jsでfetchを使ってAPIテストを行う方法](https://zenn.dev/tatsuyasusukida/articles/nodejs-test-api)<br>


エラー参考サイト<br>
[vue.jsで「The template root requires exactly one element.」とエラーが表示された時は？](https://qiita.com/yutoun/items/d72a5d3d3f7361e1cec3)