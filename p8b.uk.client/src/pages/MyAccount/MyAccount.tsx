
import React from 'react';
import { connect } from 'react-redux';
import { IReduxStoreState } from '../../reducers';
import { bindActionCreators } from 'redux';
import { PurifyComponent } from 'p8b.core.ts/src/components/Class.Extensions';
import { Container } from '../../components/Container';
import { PageHeader } from 'p8b.components.react/src/components/Texts/_index';
export class MyAccount extends PurifyComponent<IProps> {
   myState: IState = {
   };
   constructor(props: IProps) {
      super(props);
   }
   async componentDidMount() {
   }
   render() {
      return (
         <Container extendBottom>
            <PageHeader title="MyAccount" />
         </Container>
      );
   }
}
declare type IProps = {
};
declare type IState = {

};
export default connect(
   (state: IReduxStoreState) => {
      return {
         Authentication: state.Authentication
      };
   },
   dispatch => bindActionCreators({
   }, dispatch)
)(MyAccount);

