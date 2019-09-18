# Scroll Restoration Spec

- [原文地址](https://majido.github.io/scroll-restoration-proposal/history-based-api.html#web-idl)
- [原文文档](https://github.com/majido/scroll-restoration-proposal/blob/gh-pages/history-based-api.html)

本文为了便于查看将其重新格式化

This document describes an API that gives web authors additional control over
user agent's restoration of persisted user state in particular the document's
scroll position.

*NOTE*: The proposed API is now part of [WhatWG HTML Living
Standard](https://html.spec.whatwg.org/multipage/browsers.html#dom-history-scroll-restoration)

We actively solicit comments on this document either via emailing to
[whatwg-mailinglist](https://lists.w3.org/Archives/Public/public-whatwg-archive/) or opening an issue
on [github-repo](https://github.com/majido/scroll-restoration-proposal) for this repository.

## Design

We propose to modify History API and make it possible for web authors to
explicitly disable the default scroll restoration behavior. This is achieved
by adding a new attribute, `scrollRestoration`, to `window.history`.
This new attribute can take two values: 'auto', 'manual' with 'auto' being the
default.

Setting `scrollRestoration` to a new value updates the [current-entry-def](https://html.spec.whatwg.org/#current-entry) in history session. Also any future entry that is added
to history session for the same document will use this new `scrollRestoration`
value. However, changing this value does not impact any previous entries in
sessions history including those that belong to the same document.
Furthermore, any navigation to a new page with a different document resets the
`scrollRestoration` to its default value.

Note that this ensures that changes to `scrollRestoration` only affect entries that
will be created for the same document (e.g., entries created using pushState,
or due to fragment navigation).

### Child Frames

Disabling scroll restoration in one frame should not impact the
scroll restoration for any other frame including any of its child frames.

### Web IDL

```js
enum ScrollRestoration { "auto", "manual" };

partial interface History {
  attribute ScrollRestoration scrollRestoration;
};
// scrollRestoration
// Indicates whether the user agent should restore scroll position when
// traversing to this entry. Anytime this attribute is modified the current
// entry in joint session history should be updated to reflect the change.
```

## Usage

Web applications that want to implement their own custom scroll restoration
logic can disable user-agent's scroll restoration by setting the
scrollRestoration attribute. Most applications want to use the same scroll
restoration value for all of their history entries in which case they should
set the scrollRestoration attribute as soon as possible (e.g., first script
tag in the document's &lt;head&gt;) to ensure that any entry that is added to
the history session gets the desired scroll restoration value.

```js
history.scrollRestoration = 'manual';
```

Checking for existence of the `scrollRestoration` can be used as a way to feature detect:

```js
  let canControlScrollRestoration = 'scrollRestoration' in window.history
```

## Spec Changes

### History traversal

Modify the [history-traverse-algorithm](https://html.spec.whatwg.org/#history-traversal), add the
following new section to the spec defining persisted user state restoration
process and update steps 3 and 9 as following:

9. If the specified entry has persisted user state, and the user agent wants
to update aspects of the document and its rendering **it should run the
`persisted user state restoration` steps.**

#### Persisted user state restoration

Run the following steps immediately:

1. If the entry has an scroll restoration value, let *scrollRestoration* be that.

2. If *scrollRestoration* is 'manual' the user agent should not
restore the scroll position for the document otherwise it may.

3. Set `history.scrollRestoration` to *scrollRestoration*

4. User agent may now update other aspects of the document and its
rendering, for instance values of form fields, that it had previously
recorded.

### Push State

Modify the [pushstate-algorithm](https://html.spec.whatwg.org/#dom-history-pushstate) and update a step 4.3 as following:

4.3. If appropriate, update the current entry to reflect any state that
the user agent wishes to persist, **and current history scroll restoration
value**. The entry is then said to be an entry with persisted user state.

### Navigating to Fragment

Modify the [scroll-to-frag-algorithm](https://html.spec.whatwg.org/#scroll-to-fragid) and update step 3 as following:

3. Append a new entry at the end of the History object representing the new
resource and its Document object, related state, **and  current history
scroll restoration value**. Its URL must be set to the address to which the
user agent was navigating. The title must be left unset.

### Navigating to a new page

Modify the [update-session-algorithm](https://html.spec.whatwg.org/#update-the-session-history-with-the-new-page) algorithm  and update step 2.2 as following:

2.2. Append a new entry at the end of the History object representing
the new resource and its Document object and related state **and with default
history scroll restoration value i.e. "auto"**.