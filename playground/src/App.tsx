import React, { useState } from 'react';
import AnyAttribute, { asObject, asString, asBoolean, useAnyAttributes } from '../../src/index';
import OuterHtmlPreview from './OuterHtmlPreview';

function ReadmeExampleDemo() {
  const myDataObject = { name: 'Your Name', age: 120, pet: 'cat' };
  return (
    <section>
      <h2>1. README example</h2>
      <p>The exact snippet from the README: mixed asObject/asString/plain values.</p>
      <AnyAttribute
        attributes={{
          objectTimestamp: asObject(new Date().valueOf()),
          stringTimestamp: asString(new Date().valueOf()),
          objectAsString: asString({ data: myDataObject }),
          objectAsObject: asObject({ data: myDataObject }),
          objectAsIs: myDataObject,
          anythingElse: 'Hello darkness my old friend...',
        }}
      >
        <input id="readme-input" readOnly />
      </AnyAttribute>
      <OuterHtmlPreview targetId="readme-input" />
    </section>
  );
}

function ReactivityDemo() {
  const [on, setOn] = useState(false);
  return (
    <section>
      <h2>2. Reactive updates</h2>
      <p>Attributes now update live on re-render, and stale keys are removed.</p>
      <button onClick={() => setOn(!on)}>toggle</button>
      <AnyAttribute
        attributes={
          on
            ? { status: 'active', mode: 'on' }
            : { status: 'idle' }
        }
      >
        <div id="reactive-div" />
      </AnyAttribute>
      <OuterHtmlPreview targetId="reactive-div" />
    </section>
  );
}

function HookDemo() {
  const [count, setCount] = useState(0);
  const ref = useAnyAttributes<HTMLDivElement>({ 'data-count': count, 'data-parity': count % 2 === 0 ? 'even' : 'odd' });
  return (
    <section>
      <h2>3. useAnyAttributes hook</h2>
      <p>Attach directly as a ref, no wrapper component needed.</p>
      <button onClick={() => setCount(count + 1)}>increment ({count})</button>
      <div id="hook-div" ref={ref} />
      <OuterHtmlPreview targetId="hook-div" />
    </section>
  );
}

function BooleanAndRemovalDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <section>
      <h2>4. asBoolean + attribute removal</h2>
      <p>
        <code>asBoolean</code> gives HTML-idiomatic presence/absence; setting a
        value to <code>undefined</code> removes the attribute entirely.
      </p>
      <button onClick={() => setChecked(!checked)}>toggle</button>
      <AnyAttribute
        attributes={{
          idiomaticFlag: asBoolean(checked),
          legacyFlag: checked,
          removedWhenFalse: checked ? 'present' : undefined,
        }}
      >
        <div id="boolean-div" />
      </AnyAttribute>
      <OuterHtmlPreview targetId="boolean-div" />
    </section>
  );
}

export default function App() {
  return (
    <main>
      <h1>react-any-attr playground</h1>
      <ReadmeExampleDemo />
      <ReactivityDemo />
      <HookDemo />
      <BooleanAndRemovalDemo />
      <style>{`
        body { font-family: system-ui, sans-serif; margin: 0; }
        main { max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
        section { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #ddd; }
        .preview { display: block; background: #111; color: #7fdc7f; padding: .75rem; border-radius: 6px; margin-top: .5rem; white-space: pre-wrap; word-break: break-all; font-size: .85rem; }
        button { margin: .5rem 0; }
      `}</style>
    </main>
  );
}
