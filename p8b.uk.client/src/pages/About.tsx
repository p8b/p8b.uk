import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from '../components/Container';
import { PageHeader } from 'p8b.components.react/src/components/Texts/_index';
import { PurifyComponent } from 'p8b.core.ts/src/components/Class.Extensions';
import { IReduxStoreState } from '../reducers';
export class About extends PurifyComponent<IProps> {
   myState = {
   };
   constructor(props: IProps) {
      super(props);
   }
   render() {
      return (
         <Container className="text-justified p-4 pb-5 bg-white" extendBottom>
            <PageHeader title="About Me" />
            <p className="h5 mb-3" children="I recently graduated from the University of Greenwich with a First Class Honours Degree in BSc Computing. I am a passionate software developer specialising in web development by utilising technologies such as React, ASP.NET Core MVC, MS SQL and SASS. I have experience building Web APIs and applications in both monolith and microkernel software architectures and familiar with microservices which I am looking forward to work with in the future." />
            <p className="h5" children="I also practice building Windows applications (UWP) as well as mobile applications (Xamarin) and would love to learn more technologies in this category such as React Native and Flutter. I love learning new technologies to further my knowledge and I am open for new job opportunities to design and develop exciting software solutions." />
         </Container>
      );
   }
}
declare type IProps = {
};
export default connect(
   (state: IReduxStoreState) => {
      return {
         Authentication: state.Authentication
      };
   },
   dispatch => bindActionCreators({
   }, dispatch)
)(About);