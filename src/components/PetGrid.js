import React, { useEffect, useState } from "react";
import axios from "axios";
import PetCard from "./PetCard";
/*
  The "styled-components" module is another component library
  that we can use. It's similar to Reactstrap in that it has
  methods that return component functions that we can use
  to compose our own components, but it differs in that it
  provides more extreme control over styling through CSS.

  It is an example of "CSS-in-JS", which is a concept and
  approach that is implemented by many different packages.

  To use styled-components, you need to install it as a 
  dependency (i.e. declare that your app depends on it), 
  then import it.

  To install it in a terminal environment, use yarn or npm:

    * yarn add styled-components
    * npm install styled-components
      (note that the "--save" option for npm is no longer necessary
      as its behavior is the default.)

  To install it in codesandbox:

    * Click the "Add Dependency" button to the <--left.
    * Search for "styled-components", and add it.

  This will add the styled-components module, along with all
  of *it's* dependencies, to the node_modules folder of your
  project (you must be in your project directory when you run
  the command). It also updates the package.json by adding the
  styled-components module to the "dependencies" section.
*/
import styled from "styled-components";

/*
  To demonstrate the use of the styled-components module,
  we are creating a new component called DogButton.

  styled-components is a component library, similar to 
  Reactstrap in that it manufactures components that we can
  use in our own components. The power of styled-components is
  in the way it allows us to use finely-tuned CSS to style the
  components that it creates for us.

  When we import styled-components, we get an object on which
  we can call methods. Each method returns a component function.

  Let me say that again: each method returns a *component function*.

  styled.button is a function that returns a React component function.
  styled.div is a function that returns a React component function.
  etc.

  When we assign the return value from these functions to variables with
  names that begin with an uppercase character, we can reference 
  them as components (remember that component functions must have a capitalized
  name).

  If we were to create our own custom component *function*, we would
  reference that function as a component using a JSX tag. It's no
  different with styled-components - they are just component functions,
  and we reference them in JSX with tags, like we do with our own
  custom components.

    function MyButtonComponent() {return <button>ClickMe!</button}
    var StyledButtonComponent = styled.button();
    ...
    function MyContainerComponent() {
      return (
        <div> 
          <MyButtonComponent/> 
          <StyledButtonComponent/> 
        </div>
      );
    }

  Note that we reference the component function that comes back from
  styled-components the same way that we reference our own component
  function - using a JSX tag. And like all JSX tags, we can pass
  properties to the component function, like classname, etc.

  You call the exported functions from styled-components to create
  custom React component functions. You can also specify the *styling*
  of the React components by passing style information in to the
  styled-component functions.

  Because the styled-component functions are, well, *functions*, they 
  take parameters. It's not super-common knowledge, but you can pass
  parameters to a function in multiple ways.

  One way, of course, is to put the parameters in parentheses after
  the function name:

    var MyButton = styled.button('width: 100px; height: 30px');

  You can also pass parameters to a function using something called
  "template literal tag functions".

  A template literal tag function is a function that takes an array
  of strings as its first parameter, and then 0 or more additional 
  parameters.

  The template literal tag syntax allows you to use a template
  literal to pass parameters to the function.

  For example:

    function myTagFunction(stringArray) {
      console.log("Strings: ", stringArray);
      stringArray.forEach( txt => console.log(txt));
    }

    myTagFunction`this template literal is parsed into an array of strings`;
    myTagFunction(['this is a hard coded array of strings']);

  These two function calls are identical. In addition, template variables 
  that are included as part of the template literal, are passed to the
  template literal tag function as an additional parameter. If there
  are more than one template variable, they are each passed, in order,
  as parameters to the template literal tag function.

  For example:

    function myTagFunction(stringArray, ...values) {
      let result="";
      stringArray.forEach( (str, idx) => {
        result += str + (str ? values[idx] : "");
        // the following is equivalent the the previous line
        // result = result + str;
        // if (str != "") {
        //   result = result + values[idx];
        // }
        }
      });
      console.log(result);
    }
    
    let str1="parsed";
    let str2="string";
    myTagFunction`this string is ${str1} into an array of ${str2}`
    myTagFunction(["this string is", " into an array of "], str1, str2); 

  The two function calls above are identical.

  See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals,
  especially the "Tagged Templates" section.

  So, what does that mean for styled-components? We want to be able to 
  pass CSS into the function, so that the component function we get back
  defines a styled component. 
  
  We can do it the hard way:

      const DogButton = styled.button('width: 100px; height: 30px; background: "#fff"; color: "#2a2223"; border: 0; margin: 5px 10px; &:hover {background: "#2a2223"; color: "#fff"};');

  (Hey, at least it's on one line, right? But, we don't have an easy
   way to have conditional styling, like with a ternary operator and
   a property value... without a lot of extra if/then/else and other 
   logic...)

  Or we can do it the easy way:

      const DogButton = styled.button`
          width: 100px;
          height: 30px;
          background: ${props => (props.primary ? "#fff" : "#2a2223")};
          color: ${props => (props.primary ? "#2a2223" : "#fff")};
          border: 0;
          margin: 5px 10px;
          &:hover {
            background: ${props => (props.primary ? "#2a2223" : "#fff")};
            color: ${props => (props.primary ? "#fff" : "#2a2223")};
          }
      `;

  The template literal tag function syntax makes working with 
  CSS-in-JS a lot easier and more readable, and flexible. Note the
  use of property values and a ternary operator to achieve conditional
  styling... if the component has the "primary" property, the
  button is white, otherwise it's brown...)

  Now, about "props" ... in styled-components, if a template variable
  is a function, it will be passed a "properties" variable by styled-components.
  Keep in mind that these parameters to the styled function will be
  evaluated in the context of the component function, and so will have
  access to the component function's parameters. The parameter that is
  passed to the component function is an object that contains all
  of the properties that are set in the opening tag of the component
  when it is used via JSX. That same object, with the same properties,
  can be referenced in template literal variables, as seen below.

  The "background" and "color" CSS values are set to the result of
  a function expression that executes within a template literal variable.
  The parameter that is passed to that function is the "properties" object
  that is passed to the component function, and contains all of the
  properties in the opening tag of the JSX element for the component.

  So, in the return() statement below, the <DogButton/> component can
  have a property called "primary", which can be used in our CSS to
  conditionally style the component. Remember that the parameter to
  a function can be called anything we want to call it... it's our
  function! We just have to use that name to access it. in one 
  example below, I call the properties object parameter "bananas",
  and in the other, I call it "props" (much more reasonable...).
*/

const DogButton = styled.button`
  width: 100px;
  height: 30px;
  background: ${bananas => (bananas.primary ? "#fff" : "#2a2223")};
  color: ${bananas => (bananas.primary ? "#2a2223" : "#fff")};
  border: 0;
  margin: 5px 10px;
  &:hover {
    background: ${props => (props.primary ? "#2a2223" : "#fff")};
    color: ${props => (props.primary ? "#fff" : "#2a2223")};
  }
`;

/*
  Instead of calling one of the styled-component functions that
  returns a primitive component (like .button() or .div()), we could 
  call styled() as a function, and pass another styled component to it.

  In doing so, the new component function we are creating will have
  all of the CSS style that was passed to the original component,
  and we can change or add any number of parameters. The new component
  function will be styled identically to the original one, except for
  the CSS values that we change. Note that we still use the template
  literal tag syntax to pass the new/additional CSS to the styled() 
  method.

  In this example, we are just creating an identical, though larger,
  button based on DogButton().
*/
const LargerDogButton = styled(DogButton)`
  width: 200px;
  height: 60px;
`;

export default function PetGrid() {
  // https://dog.ceo/api/breed/hound/images/random/15
  const [pets, setPets] = useState([]);
  const [breed, setBreed] = useState("mix");

  useEffect(() => {
    axios
      .get(`https://dog.ceo/api/breed/${breed}/images/random/15`)
      .then(response => {
        const doggos = response.data.message;
        console.log(doggos);
        setPets(doggos);
      })
      .catch(error => {
        console.log("Sorry no doggos", error);
      });
  }, [breed]);

  return (
    <div className="container">
      {/* 
        note the use of the "primary" property. It's value is set
        to true or false based on the state variable "breed". If the
        current breed matches the button's text/purpose, we mark the
        button as "primary", which will impact its styling in the
        conditional CSS we used to create the component function above.
      */}
      <DogButton
        primary={breed.toUpperCase() === "MASTIFF"}
        onClick={() => setBreed("mastiff")}
      >
        Mastiff
      </DogButton>
      <LargerDogButton
        primary={breed.toUpperCase() === "LABRADOR"}
        onClick={() => setBreed("labrador")}
      >
        Labrador
      </LargerDogButton>
      <button onClick={() => setBreed("mastiff")}>Mastiff</button>
      <button onClick={() => setBreed("labrador")}>Labrador</button>
      <div className="entry">
        {pets.map(item => {
          return <PetCard key={item} breed={breed} imgUrl={item} />;
        })}
      </div>
    </div>
  );
}
