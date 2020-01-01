# Suspense for Data Fetching

> 注意：该页中描述的实验特性在稳定版中[还没有支持](https://reactjs.org/docs/concurrent-mode-adoption.html)。不要在生产应用中依赖实验性质的 `React` 构建。这些特性有很重要的改变，在成为 `React` 中一部分之前没有警告。

> 该文档旨在面向喜欢新鲜事物和对此好奇的人群。如果你刚刚开始使用 `React`，不要担心这些特性，因为你不必现在学习它们。例如，如果你正寻求现在好用的数据请求教程，可以读[这篇文章](https://www.robinwieruch.de/react-hooks-fetch-data)。

`React` _v16.6_ 中添加了 `Suspense` 组件，让你 ”等待” 加载一些代码和指定一个在等待期间中显示的加载状态（像一个 _spinner_）。

```js
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Lazy-loaded

// Show a spinner while the profile is loading
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>;
```

`Suspense for Data Fetching` 是一个新特性，也让你能使用 `<Suspense>` 来 ”等待” 其它的，包括数据。该页主要聚焦于数据请求这种使用场景，其实，它也能等待图片、脚本和其它的异步工作。

## 确切的说，什么是 `Suspense`？

`Suspense` 让你的组件在渲染前 ”等待” 某件事。在下面的例子中，2 个组件等待异步 _API_ 来请求数据：

```js
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

[在 _CodeSandbox_ 中尝试](https://codesandbox.io/s/frosty-hermann-bztrp)

上面的例子是一个预告，不理解也不要紧。现在将讲解更多它是如何工作的。记住 `Suspense` 更是一种机制，在上面的例子中，特殊的 _API_ 像 _fetchProfileData()_ 或者 _resource.posts.read_ 是不重要的。如果你很好奇，你可以在 _sandbox 的例子_ 中找到对应的定义。

`Suspense` 不是一种数据请求库，而是数据请求库告诉 `React` 组件需要的数据目前没有准备好的一种机制。然后 `React` 等到数据准备好后更新 `UI`。在 _Facebook_，我们使用集成了 `Suspense` 的 `Relay`。我们希望其它库比如像 `Apollo` 也能提供相似的集成。

长期以来，我们想让 `Suspense` 成为组件中读取异步数据的方式 - 无关数据来源。

### `Suspense` 不是什么？

`Suspense` 和现有解决方案有很大不同，首次读到这些可能让你困惑。下面阐述最常见的部分：

- 它不是数据请求的实现。它不限制你用 _GraphQL_、_REST_ 或者是其它的数据格式、库、传输或者协议。
- 你不能使用 `Suspense` 来 ”替换” 请求或者 `Relay`。但是你可以使用集成了 `Suspense` 的库（例如，新的 `Relay` APIs）
- 它不耦合数据请求和视图层。它帮助在你的 _UI_ 中显示加载状态，但是它不把你的网络逻辑捆绑在 `React` 组件中。

### `Suspense` 让你做什么

所以 `Suspense` 的重点是什么呢？我们回答一下：

- 它让数据请求库深度集成 `React`。如果一个数据请求库实现了对 `Suspense` 的支持，那么在 `React`组件中使用 `Suspense` 会感觉非常自然。
- 它让你编排有意设计过的加载状态。它没有指名数据是怎样加载的，但是它让你更密切的控制应用中的视图加载顺序。
- 它帮助你避免竞态条件。甚至使用 _await_，异步代码经常容易出错。`Suspense` 更像同步读取数据 - 好像它已经被加载。

### `Suspense` 实践

在 Facebook，到目前为止我们仅仅在生产环境中使用了集成了 `Suspense` 的 `Relay`。如果你正找一个实践指南，请检出 [`Relay` 指南](https://relay.dev/docs/en/experimental/step-by-step)！该指南示范了在生产中工作的模式。

该页中的代码例子使用了 “fake” API 实现而非 `Relay`。如果你不熟悉 `GraphQL`，那么这个例子使得理解变的简单，但并不是使用 `Suspense` 来构建应用的 “正确方式”。该页更多是概念性的，介绍了 `Suspense` 以某种方式工作的原因和它解决的问题。

### 如果不使用 `Relay` 怎么办

如果不使用 `Relay`，你必须等一段时间才能在项目中尝试 `Suspense`。距今为止，`Relay` 是我们在生产上测试过的唯一实现。在未来几个月里，许多库会有关于 `Suspense` _APIs_ 的不同实现。如果你更喜欢在事物稳定时学习，你可以现在忽略它，等到 `Suspense` 生态更成熟时再学习。

如果你喜欢，也可以为数据请求库写集成。

### 对于库作者

我们期望看到社区中其它库的实验。对于数据请求库作者来说，有 1 件重要的事情需要注意。

尽管技术上可行，`Suspense` 不是在组件渲染时作为开始请求数据的方式，而是让组件表示它们正在等待已经请求的数据。[使用 `Concurrent Mode` 和 `Suspense` 构建友好用户体验](https://zh-hans.reactjs.org/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) 解释了它的重要性和如何在实际中实现这种模式

除非你有解决方案来帮助你处理阻止 _waterfalls_ 问题，我们建议在渲染前同意或者执行请求 _APIs_。一个具体例子，你可以看到 [Relay Suspense API](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery) 如何执行预加载。过去，针对此问题我们的发布并没有保持一致性。`Suspense for Data Fetching` 仍然具有实验性，随着我们从生产使用中了解更多和更好理解这个问题，我们的建议也会改变。

---

## 传统方式和 `Suspense` 的对比

我们介绍 `Suspense` 没有提及其它流行的数据请求方式。这很难看出来 `Suspense` 解决了什么问题和为什么这些问题值得解决以及 `Suspense` 和已存在的方式有何不同。

接下来，我们将看下包括 `Suspense` 在内的三种方式：

- `Fetch-on-render`（例如，在 _ useEffect_ 中请求）：开始渲染组件。每个组件都在它们的副作用和生命周期函数中触发数据请求。这种方式经常导致 “waterfalls”。
- `Fetch-then-render`（例如，不使用 `Suspense` 的 `Relay`）：尽早请求下一屏需要所有的数据。当数据准备好后，渲染新视图。直到数据拿到时才能做其它事情。
- `Render-as-you-fetch`（例如，使用 `Suspense` 的 `Relay`）：尽早请求下一屏必需的所有数据，在拿到请求响应前，立即开始渲染新视图。直到数据准备好后，`React` 重新尝试渲染组件。

> 这个有点简单，实际会混用不同方式。我们仍然单独观察它们以更好来比较。

为了比较这三种方式，我们将利用其各自实现一个介绍页。

### 解决方案一：`Fetch-on-Render` （不使用 `Suspense`）

现在，在 `React` 应用中请求数据一种通用的方式就是使用 _effect_：

```js
// In a function component:
useEffect(() => {
  fetchSomething();
}, []);

// Or, in a class component:
componentDidMount() {
  fetchSomething();
}
```

我们称呼这种方式为 `Fetch-on-Render`，因为直到组件在屏幕上渲染完毕才会开始请求数据。这样会导致一个叫做 `waterfall` 的问题。

考虑一下 _<ProfilePage>_ 和 _<ProfileTimeline>_ 组件：

```js
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(u => setUser(u));
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then(p => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

[在 _CodeSandbox_ 中尝试](https://codesandbox.io/s/fragrant-glade-8huj6)

运行代码观察控制台日志，发现顺序是：

1. 开始请求用户详情
2. 等待
3. 完成用户详情请求
4. 开始请求发布
5. 等待
6. 完成发布请求

如果请求用户详情花费 3s，那么将在 3s 后请求发布！这就是 “waterfall”：不相关的顺序应该被并行。

在代码中渲染之后请求数据通常会出现 `Waterfalls` 问题。它们应该被解决，不过随着业务的增长，很多人更喜欢预防这个问题。

### 方式二：`Fetch-Then-Render` (不使用 `Suspense`)

库通过提供一个集中的方式进行数据请求来阻止 `waterfalls`。例如，`Relay` 解决这个问题，通过移动组件需要的数据到静态分析碎片，之后组合成一个请求。

该页，假设不了解 `Relay`，在这个例子中我们不必用它，使用合并数据请求方法来替代：

```js
function fetchProfileData() {
  return Promise.all([fetchUser(), fetchPosts()]).then(([user, posts]) => {
    return { user, posts };
  });
}
```

在这个例子中，_<ProfilePage>_ 等待并行开始的 2 个请求

```js
// Kick off fetching as early as possible
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then(data => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// The child doesn't trigger fetching anymore
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

[在 _CodeSandbox_ 中尝试](https://codesandbox.io/s/wandering-morning-ev6r0)

现在顺序变成现在这样：

1. 开始请求用户详情
2. 开始请求发布
3. 等待
4. 完成用户详情请求
5. 完成发布请求

我们解决了之前的网络 “waterfall”，但是意外的引入了其它问题。我们在 _ fetchProfileData_ 里面使用 _Promise.all()_ 来等待所有数据，直到发布数据也被请求完成后才会渲染介绍详情，可是我们不得不一直等待 2 个接口的返回。

当然，在这个特殊的例子中修复是可能的。可以移除 _Promise.all()_ 调用，分别等待 2 个 _Promises_ 的返回结果。然而，这种方式会随着数据复杂和组件树增长而变得更加困难。当数据树中的部分可能丢失或者过期时，写一个可靠的组件变得很难。因此为一个新视图请求所有数据然后渲染经常是一个更加实践的选项。

### 方式三：`Render-as-You-Fetch`（使用 `Suspense`）

在上面一种方式中，在调用 _setState_ 之前来请求数据

1. 开始请求
2. 完成请求
3. 开始渲染

使用 `Suspense`，仍然首先请求数据，但是我们交换后 2 步：

1. 开始请求
2. 开始渲染
3. 完成请求

使用 `Suspense`，无需在渲染前等待响应。事实上，在开始网络请求后马上开始渲染。

```js
// This is not a Promise. It's a special object from our Suspense integration.
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

[在 _CodeSandbox_ 中尝试](https://codesandbox.io/s/frosty-hermann-bztrp)

在视图上渲染 `<ProfilePage>` 后发生了以下事件：

1. 在 `fetchProfileData()` 中开始请求。返回一个特别的 “resource” 来取代 _Promise_。真实例子中，可能是一个集成了 `Suspense` 数据请求库，像 `Relay`。
2. `React` 尝试渲染 `<ProfilePage>`。返回孩子节点 `<ProfileDetails>`  和  `<ProfileTimeline>`。
3. `React` 尝试渲染 `<ProfileDetails>`，调用 `resource.user.read()`。数据请求没有完成，所以该组件被挂起。`React` 跳过它，然后尝试树中的其它组件。
4. `React` 尝试渲染 `<ProfileTimeline>`。调用 `resource.posts.read()`。同时，也没有数据被准备好，因此这个组件也被挂起。`React` 也跳过它，然后尝试树中的其它组件。
5. 没有其它的尝试渲染。因为 `<ProfileDetails>` 被挂起了，所以 `React` 显示在树中它上面最近 `<Suspense>` 的 `fallback`：`<h1>Loading profile...</h1>`。

_resource_ 对象代表目前没有的数据，不过最后会加载。当调用 _read()_ 时，要不得到数据要不组件被挂起。

_随着更多数据流产出，React 将会尝试重新渲染，每次进度都会更近一步。_ 当 _resource.user_ 请求完成，`<ProfileDetails>` 组件会被成功渲染，不再需要 `<h1>Loading profile...</h1>` _fallback_。最后，我们将获得所有数据，屏幕上不再有 _fallback_。

有一个有意思的地方是使用 _GraphQL_ ，在一个单独请求中收集所有数据需求，流化响应让我们更快展示更多内容。因为 `render-as-we-fetch`（和渲染后相反），如果接口返回 _user_ 早于 _posts_，将会在响应结束前解锁外部 `<Suspense>`。回忆一下之前的例子， `fetch-then-render` 这种解决方案包括 `waterfall`：在请求和渲染之间。`Suspense` 没有 `waterfall` 这种问题你，像 `Relay` 一样的库利用了这一点。

看一下我们是如何从我们的组件里排除了 `if (…)` “正在加载” 的检查。这样做不仅移除了样板代码，也简化了设计改变。例如，如果我们想要介绍详情和发布总是一起 “弹出”，我们需要删除它们之间的 `<Suspense>`。或者我们想要使用各自的 `<Suspense>` 来彼此独立。`Suspense` 改变加载状态粒度和没有侵入性改变代码来改变它们的顺序。

---

## 尽早开始请求

如果你正工作于一个数据请求库，你一定不想错过 `Render-as-You-Fetch`。我们在渲染前开始请求数据。看下下面的代码示例：

```js
// Start fetching early!
const resource = fetchProfileData();

// ...

function ProfileDetails() {
  // Try to read user info
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

[在 _CodeSandbox_ 中尝试](https://codesandbox.io/s/frosty-hermann-bztrp)

在这个例子中 _read()_ 调用没有开始请求。它仅仅在请求结束时才读取数据。这个不同在使用 `Suspense` 来创建应用是非常关键的。我们不想直到组件开始渲染时才延迟加载数据。作为一个数据请求库的作者，你得实现这个使得开始请求时得到 _resource_ 对象。该页中的每个例子使用我们的 ”fake API” 模拟这个。

你可能会反对在顶层请求，像这个例子一样觉着是不切合实际的。如果导航到另一个介绍页会做什么呢？我们想要基于 _props_ 来请求。答案是 _我们想要在事件处理中开始请求_。下面是一个简单的用户页面导航的例子：

```js
// First fetch: as soon as possible
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button
        onClick={() => {
          const nextUserId = getNextId(resource.userId);
          // Next fetch: when the user clicks
          setResource(fetchProfileData(nextUserId));
        }}
      >
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

[在 _CodeSandbox_ 中尝试](https://codesandbox.io/s/infallible-feather-xjtbu)

使用这种方式，我们能 _并行请求代码和数据_。当在页面之间切换时，无需等待页面的代码开始加载它所需的数据。我们可以同时加载代码和数据（在链接点击期间），获得更好的用户体验。

还有一个问题就是我们怎么知道在下一屏渲染前渲染什么。有很多方式来解决这个问题（例如，通过路由解决方案集成数据请求）。如果你工作于数据请求数据，[使用 `Concurrent` 模式和 `Suspense` 提升用户体验](https://zh-hans.reactjs.org/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html)深入解读如何做和为什么如此重要。

### 我们需要弄清楚的事情

`Suspense` 机制很弹性，没有很多约束。业务代码需要更加约束确保没有 `waterfalls`，但是有不同方式来确保这个。我们正在探索的一些问题包括：

- 尽早的请求。我们怎样让它变得更加简单从而避免 `waterfalls`？
- 当在页面中请求数据时，_API_ 提倡数据即时转换吗？
- 响应的周期是什么？缓存是全局的还是局部的？谁来管理缓存？
- 在不调用 _read()_ 的地方，代理可以帮助懒加载 APIs 吗？
- 对于 `Suspense` 数据还有其它类似于组合 _GraphQL_ 查询的同等方式吗？

`Relay` 有针对上面问题的答案，相信肯定还有其它解决方案，我们很高兴能看到 `React` 社区能提出一些新的想法。

---

## `Suspense` 和 _竞态条件_

代码运行的顺序不正确可能导致 _竞态条件_。在 Hook _useEffect_ 或者在类组件生命周期函数像 _componentDidUpdate_ 中请求数据经常导致这个。`Suspense` 对这个也有帮助 - 让我们看下。

为了演示这个问题，将添加顶层 `<App>` 组件来渲染 `<ProfilePage>` 和一个按钮让我们在不同介绍页之间切换：

```js
function getNextId(id) {
  // ...
}

function App() {
  const [id, setId] = useState(0);
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>Next</button>
      <ProfilePage id={id} />
    </>
  );
}
```

对比一下不同数据请求策略如何处理。

### 使用 `useEffect` 导致的 _竞态条件_

首先，我们尝试上面 ”在 effect 中请求” 的例子版本。修改它从 `<ProfilePage>` 的 _props_ 中传递 `id` 参数给 _fetchUser(id)_ 和 _fetchPosts(id)_：

```js
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline id={id} />
    </>
  );
}

function ProfileTimeline({ id }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(id).then(p => setPosts(p));
  }, [id]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

[在 _CodeSandbox_ 中尝试](https://codesandbox.io/s/nervous-glade-b5sel)

把 _effect_ 的依赖从 _[]_ 改变成 _[id]_ - 因为我们想要当 _id_ 改变时 _effect_ 重新运行。否则，不能重新请求新数据。

运行代码，第一次看起来没有问题。如果在 _“fake API”_ 实现中随机延迟时间和快速点击 _Next_ 按钮，我们将看到控制台日志有些错误。_在切换介绍页到另一个 ID 时上一个介绍的请求可能有时才回来 - 在这种场景中可能用不同 ID 的过期响应来覆盖新的状态_

这个问题可能被修复（你可能使用 _effect_ _清理_ 函数来忽略或者取消过期请求），但是会变得不直观和难于调试。

### 使用 _componentDidUpdate_ 导致的 _竞态条件_

有人想这个问题可能仅存在于 _useEffect_ 或者 _Hooks_ 中。
如果我们把代码放到类中或者使用像 _async / await_ 方便的语法，这样会解决问题吗？

让我们试下：

```js
class ProfilePage extends React.Component {
  state = {
    user: null
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const user = await fetchUser(id);
    this.setState({ user });
  }
  render() {
    const { id } = this.props;
    const { user } = this.state;
    if (user === null) {
      return <p>Loading profile...</p>;
    }
    return (
      <>
        <h1>{user.name}</h1>
        <ProfileTimeline id={id} />
      </>
    );
  }
}

class ProfileTimeline extends React.Component {
  state = {
    posts: null
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const posts = await fetchPosts(id);
    this.setState({ posts });
  }
  render() {
    const { posts } = this.state;
    if (posts === null) {
      return <h2>Loading posts...</h2>;
    }
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    );
  }
}
```

[在 _CodeSandbox_ 中尝试](https://codesandbox.io/s/trusting-clarke-8twuq)

以上代码不易阅读。

不幸的是，使用类和 _async / await_ 语法仍然没有解决问题。同样的原因，这个版本也有 _竞态条件_ 问题。

### 问题

`React` 组件有它们自己的生命周期。在任何时间点，它们能接收到 _props_ 或者更新状态。然而，每一个异步请求也有它自己的生命周期。当我们开始时它开始，当我们得到响应时结束。难点在于相互影响的多进程及时同步讨论。

### 使用 `Suspense` 来解决 _竞态条件_ 问题

重写上面的例子，但是只使用 `Suspense`：

```js
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button
        onClick={() => {
          const nextUserId = getNextId(resource.userId);
          setResource(fetchProfileData(nextUserId));
        }}
      >
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

[在 _CodeSandbox_ 中尝试](https://codesandbox.io/s/infallible-feather-xjtbu)

在上面的 `Suspense` 例子中，我们只有一个 _resource_，因此在顶层变量中保存它。现在我们有了多个 _resources_，我们把它移动到 `<App>` 组件的 state 中：

```js
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
```

当我们点击 ”Next” 时，`<App>` 组件为下一个介绍开始下一个请求，传输给 `<ProfilePage>` 组件一个对象：

```js
<>
  <button
    onClick={() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    }}
  >
    Next
  </button>
  <ProfilePage resource={resource} />
</>
```

_我们不等待响应来设置状态。在开始请求后立即设置 state（开始渲染）_。一旦我们有更多的数据，`React` 将会在 `<Suspense>` 组件内部填入内容。

`Suspense` 版本不像较早的例子，代码变得可读，也没有 _竞态条件_ 问题。你可能想知道原因。答案是在 `Suspense` 版本中，我们不必在我们代码中考虑时间。有 _竞态条件_ 的代码需要在随后准确的时间中设置状态，否则它有可能出错。但是使用 `Suspense`，我们马上设置状态 - 所以混乱变得很难。

---

## 错误处理

当我们使用 _Promises_ 写代码时，我们使用 _catch()_ 来处理错误。考虑不等待 _Promises_ 就开始渲染，使用 `Suspense` 如何处理错误的？

使用 `Suspense`，处理请求错误和处理渲染错误是一样的方式 - 你能在下面的组件里任意处渲染一个 [_错误边界_](https://reactjs.org/docs/error-boundaries.html) 来处理错误。

首先，在项目中定义一个 _边界错误_ 组件：

```js
// Error boundaries currently have to be classes.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

然后把它放在树中来捕获错误：

```js
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

[在 _CodeSandbox_ 中尝试](https://codesandbox.io/s/adoring-goodall-8wbn7)

它能同时捕获渲染和 `Suspense data fetching` 的错误。可以按照我们的需求来定义错误边界，但是最好[设计](https://aweary.dev/fault-tolerance-react/)它们的位置。

---

## 下一步

现在，我们已经概述了 `Suspense for Data Fetching` 的基础。已经能够更好理解 `Suspense` 为什么生效和它怎样在数据请求中使用。

`Suspense` 回答了这些问题，同时也有自身的新问题：

- 如果组件被 _挂起_ 了，_app_ 会被冻结吗？如何避免？
- 如何在树中组件的其它位置展示一个 _spinner_？
- 如何在短时间内展示一个不一致的 _UI_？
- 不展示 _spinner_，能够在当前屏幕上添加 ”变灰” 的视觉效果吗？
- 为什么最后一个例子中在点击 ”Next” 按钮时，打印警告？

为了回答以上问题，可以查看 [Concurrent UI Patterns](https://reactjs.org/docs/concurrent-mode-patterns.html) 这部分。
