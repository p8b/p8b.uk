import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PurifyComponent } from 'p8b.core.ts/src/components/Class.Extensions';
import { Container } from '../components/Container';
import { PageHeader, Alert } from 'p8b.components.react/src/components/Texts/_index';
import { IReduxStoreState } from '../reducers';
import { Input } from 'p8b.components.react/src/components/Inputs/Input';
import { TextArea } from 'p8b.components.react/src/components/Inputs/_index';
import { Button } from 'p8b.components.react/src/components/Buttons/Button';
import { Row } from 'p8b.components.react/src/components/PureElements/Row';
import { ContactMe } from '../core/AppClass';
import { postContactMe, IContactMeAction } from '../actions/ContactMeAction';
export class Contact extends PurifyComponent<IProps> {
   myState = {
      contactMe: new ContactMe(),
   };
   constructor(props: IProps) {
      super(props);
      this.Submit = this.Submit.bind(this);
   }
   componentDidMount() {
      window.scrollTo({
         top: 0,
         left: 0,
         behavior: "smooth"
      });
   }
   async Submit() {
      this.reRender(() => this.alert.List = []);
      await this.props.postContactMe(this.myState.contactMe, (result: IContactMeAction) => {
         this.reRender(() => this.alert = result.alert);
      });
   }
   render() {
      return (
         <Container className="text-justified pt-4 pb-5 bg-white" extendBottom>
            <PageHeader className="text-center" title="Get in touch" />
            <Row className="justify-content-center " >
               <div className="col-12 col-md-8">
                  <Input className="col-12" lblText="Name/ Company*" bindedValue={this.myState.contactMe.name}
                     showDanger={this.alert.checkExist("Name")}
                     onChange={i => this.myState.contactMe.name = i.target.value} />
                  <Input className="col-12" lblText="Email*" bindedValue={this.myState.contactMe.email}
                     showDanger={this.alert.checkExist("Email")}
                     onChange={i => this.myState.contactMe.email = i.target.value} />
                  <Input className="col-12" lblText="Subject" bindedValue={this.myState.contactMe.subject}
                     showDanger={this.alert.checkExist("Subject")}
                     onChange={i => this.myState.contactMe.subject = i.target.value} />
                  <TextArea className="col-12" lblText="What would like to say?*" rows={5}
                     showDanger={this.alert.checkExist("Messege")}
                     bindedValue={this.myState.contactMe.messege}
                     onChange={i => this.myState.contactMe.messege = i.target.value} />
                  <Alert className="col-12" alert={this.alert} onClosed={() => this.reRender(() => this.alert.List = [])} />
                  <Button children="Submit" className="col-12 btn-lg btn-green mt-2"
                     onClick={this.Submit}
                  />
               </div>
            </Row>
         </Container >
      );
   }
}
declare type IProps = {
   postContactMe: typeof postContactMe;
};
declare type IState = {

};
export default connect(
   (state: IReduxStoreState) => {
      return {
      };
   },
   dispatch => bindActionCreators({
      postContactMe
   }, dispatch)
)(Contact);

