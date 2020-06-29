// import React from "react";
// import { Route, Redirect } from "react-router-native";
// import { useAuth } from "../../context/AuthContext";
// import { RT_SECURITY_LOGIN } from "../../config/_constants";

// function PrivateRoute({ component: Component, ...rest }) {
//   const { user } = useAuth();
//   return (
//     <Route
//       {...rest}
//       render={props => {
//         if (user) {
//           return <Component {...props} />;
//         } else {
//           return (
//             <Redirect
//               to={{
//                 pathname: RT_SECURITY_LOGIN,
//                 state: { from: props.location },
//               }}
//             />
//           );
//         }
//       }}
//     />
//   );
// }

// export default PrivateRoute;
