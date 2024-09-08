
// function customRender(maincontainer , reactelement){
//  const divelement = document.createElement(reactelement.type);
//  divelement.innerHTML = reactelement.children;
//  divelement.setAttribute('target' , reactelement.props.target );
//  divelement.setAttribute( 'href' , reactelement.props.href );
//  maincontainer.appendChild(divelement);
// }

function customRender(maincontainer , reactelement){
    const divelement = document.createElement(reactelement.type);
    divelement.innerHTML = reactelement.children;
    for (const prop in reactelement.props) {
        if (prop === 'children') {
         continue;
        }
    divelement.setAttribute( prop , reactelement.props[prop]);
    }
    maincontainer.appendChild(divelement);
}

const reactelement = {
   type : 'a',
   props : {
     href : 'http:google.com' ,
     target : '_blank'
   },
   children : 'Please click me to visit google'
}

const maincontainer = document.querySelector("#root")

customRender( maincontainer , reactelement)