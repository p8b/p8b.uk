import React, { useEffect } from 'react';
import Container from '../components/Container';
import { PageHeader } from '../components/Texts/PageHeader';
const About = () => {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);
   return (
      <Container className="text-justified p-4 pb-5 bg-white">
         <PageHeader title="About Me" />
         <p className="h5 mb-3">
            I recently graduated from the University of Greenwich
            with a First Class Honours Degree in BSc Computing.
            I am a passionate software developer specialising in web
            development by utilising technologies such as ReactJS,
            ASP.NET Core MVC, MS SQL and SASS.
            </p>
         <p className="h5">
            I also practice building Windows applications (UWP)
            as well as mobile applications (Xamarin) and would love
            to learn more technologies in this category such as
            React Native and Flutter. I love learning new technologies
            to further my knowledge and I am open for new job opportunities
            to design and develop exciting software solutions.
         </p>
      </Container>
   );
};
export default About;