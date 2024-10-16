
# two ways 
1. npx create-react-app
2. npm create vite@latest

<></> - fragment

1. when making components, always capitalize name(function).
2. file extension .jsx , bcz some libraries like vite force us for that
3. return only 1 components


# Learnings:-
1) For Custom React (BTS of React) - in HTML  create div attach js , In JS - get that div and create our own custom Element(as like react sees element)  then for rendering we create a custom render methods which create the element in HTML and injects it in the div or container
2) When we create a component in react by default babel(Transpiler) will inject a element React.createElement ()
3) we declare as type ,attribute , children , Evaluated Expression(final answer code after expression ) 

# HOOKS in react 
methods to update the ui component 
1) Hooks can only be called inside React function components.
2) Hooks can only be called at the top level of a component.
3) Hooks cannot be conditional

# Hydration
In web development, hydration or rehydration is a technique in which client-side JavaScript converts a static HTML web page,
delivered either through static hosting or server-side rendering, into a dynamic web page by attaching event handlers to the HTML 
elements.

# What is reconciliation?
reconciliation
The algorithm React uses to diff one tree with another to determine which parts need to be changed.
update
A change in the data used to render a React app. Usually the result of `setState`. Eventually results in a re-render.

Reconciliation is the algorithm behind what is popularly understood as the "virtual DOM." A high-level description goes something like 
this: when you render a React application, a tree of nodes that describes the app is generated and saved in memory. This tree is then 
flushed to the rendering environment — for example, in the case of a browser application, it's translated to a set of DOM operations. 
When the app is updated (usually via setState), a new tree is generated. The new tree is diffed with the previous tree to compute which 
operations are needed to update the rendered app.

Although Fiber is a ground-up rewrite of the reconciler, the high-level algorithm described in the React docs will be largely the same. 

## The key points are:
1) Different component types are assumed to generate substantially different trees. React will not attempt to diff them, but rather 
replace the old tree completely.
2) Diffing of lists is performed using keys. Keys should be "stable, predictable, and unique."

## some more important points -
1. The createRoot create's its own DOM and then compare it with the web browser's DOM and only update those components which are 
actually updated.
2. But the browser removes the whole DOM and then recreates the whole DOM with the updated values this is called reload.
3. However virtual DOM tracks whole DOM like a tree like structure and updates only those values which were only changed.
4. But some values depends on network call so if we update a value it might get update immediately via a network call.
5. So we will have to update it again. To avoid this overhead we can drop the updation calls for the immediate value update.
6. The current algo used by the React is called the React Fibre algo.
7. The algo react uses to differentiate the web browser's tree and React's tree formed through create root is called reconciliation.
8. Reconciliation is the algo behind what popularly known as the Virtual-DOM.
9. In UI it is not necessary for every update to be applied immediately. 

Resources - https://github.com/acdlite/react-fiber-architecture

# React props 
-: to send data from one component to another.

Props are sent inside the component brackets.
eg. <Card channel = "chaiaurcode"/> 
1 Always use curly brackets for a variable { variableName } to send it as props.
Props can be in any form but passed as a variable.
eg. <Card username = "chaiaurcode"/> 
eg. <Card object = "myobject"/> 
eg. <Card array = "myarray"/> 

2 props send the data in the object form to the component.
so to access ->      props.properties or {properties ="defaultValue if props doesn't receive any value"}
eg.props.username

# Detailed explaination of why does first syntax only updates the count once:
Initial State: Assume count is initially 69.
First Call: setCount(count + 1) schedules a state update to set count to 70 (69 + 1).
Second Call: setCount(count + 1) schedules another state update to set count to 70 (69 + 1), because count is still 69 in this scope.
Third Call: setCount(count + 1) schedules yet another state update to set count to 70 (69 + 1), again because count is still 69 in this scope.

In case of functional updater syntax React ensures that changes are made to the latest state of the count hence each function gets access to the latest state of the count variable:
First Call: setCount(count =>count+1) schedules a state update to set count to 70
Second Call : schedules a state update to set count to (70+1) because count is now 70 in this scope 

# useCallback , useref , useEffect
## useCallback
You need to pass two things to useCallback:
1) A function definition that you want to cache between re-renders.
2) A list of dependencies including every value within your component that’s used inside your function.
On the initial render, the returned function you’ll get from useCallback will be the function you passed.

On the following renders, React will compare the dependencies with the dependencies you passed during the previous render. If none of the dependencies have changed (compared with Object.is), useCallback will return the same function as before. Otherwise, useCallback will return the function you passed on this render.

In other words, useCallback caches a function between re-renders until its dependencies change.

## useEffect -->
useEffect is a React Hook that lets you synchronize a component with an external system.
useEffect(setup, dependencies?)
You need to pass two arguments to useEffect:
 1) A setup function with setup code that connects to that system.
It should return a cleanup function with cleanup code that disconnects from that system.
 2) A list of dependencies including every value from your component used inside of those functions.
React calls your setup and cleanup functions whenever it’s necessary, which may happen multiple times:

Your setup code runs when your component is added to the page (mounts).
After every re-render of your component where the dependencies have changed:
First, your cleanup code runs with the old props and state.
Then, your setup code runs with the new props and state.
Your cleanup code runs one final time after your component is removed from the page (unmounts).

## useRef
useRef is a React Hook that lets you reference a value that’s not needed for rendering.

const ref = useRef(initialValue)
* Parameters 
initialValue: The value you want the ref object’s current property to be initially. It can be a value of any type. This argument is ignored after the initial render.
* Returns 
useRef returns an object with a single property:
* current: Initially, it’s set to the initialValue you have passed. You can later set it to something else. If you pass the ref object to React as a ref attribute to a JSX node, React will set its current property.
On the next renders, useRef will return the same object.

## difference between link in react-router-dom and a tag
anchor tag or <a> tag is not used in React as it refreshes the whole page which is not the concept of react, that's why Link tag is used in react which is imported from react-router-dom 
 React also provides NavLink with some additional features like highlighting the active nav page.

## useparams
The useParams hook returns an object of key/value pairs of the dynamic params from the current URL that were matched by the <Route path>. Child routes inherit all params from their parent routes.

## UseloaderData
This hook provides the value returned from your route loader.
After route actions are called, the data will be revalidated automatically and return the latest result from your loader.

Note that useLoaderData does not initiate a fetch. It simply reads the result of a fetch React Router manages internally, so you don't need to worry about it refetching when it re-renders for reasons outside of routing.

This also means data returned is stable between renders, so you can safely pass it to dependency arrays in React hooks like useEffect. It only changes when the loader is called again after actions or certain navigations. In these cases the identity will change (even if the values don't).

You can use this hook in any component or any custom hook, not just the Route element. It will return the data from the nearest route on context.

To get data from any active route on the page, see useRouteLoaderData.

## ContextAPI
The useContext hook in React provides an easy way to share data between components without having to pass props manually at every level. It allows you to access the value of a context in any component,
1. Create a Context: First, you create a context using the React.createContext() method. This provides a way to define a "global" value that can be shared across components.

2. Provide the Context Value: You use the Provider component that comes with the context to specify the value of the context. The Provider wraps the components that need access to the context.

3. Consume the Context Value: Any component can use the useContext hook to access the context's value without passing props.yougotthis

## What is Prop Drilling?
Prop drilling, also known as "threading props" or "component chaining," refers to the process of passing data from a parent component down to nested child components through props.

Prop drilling occurs when a prop needs to be passed through several layers of nested components to reach a deeply nested child component that actually needs the prop. Each intermediary component in the hierarchy has to pass the prop down, even if it doesn't use the prop itself.
