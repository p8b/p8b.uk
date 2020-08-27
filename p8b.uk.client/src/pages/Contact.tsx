import React, { useEffect, useState } from 'react';
import Container from '../components/Container';
import { ContactMe } from '../core/apiClass';
import { PageHeader } from '../components/Texts/PageHeader';
import { Row } from '../components/PureElements/Row';
import { Input } from '../components/Inputs/Input';
import { TextArea } from '../components/Inputs/TextArea';
import { Alert } from '../components/Texts/Alert';
import { Button } from '../components/Buttons/Button';
import { AlertObj } from '../core/appClasses';
import useContactMe from '../customHooks/apiCallers/contact/postContact';
const Contact = () => {
   const [contactMe, setContactMe] = useState(new ContactMe());
   const [alert, setAlert] = useState(new AlertObj());
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);
   const Submit = async () => {
      setAlert(new AlertObj());
      setAlert(await useContactMe(contactMe));
   };
   return (
      <Container className="text-justified pt-4 pb-5 bg-white">
         <PageHeader className="text-center" title="Get in touch" />
         <Row className="justify-content-center " >
            <div className="col-12 col-md-8 ">
               <Input className="col-12" lblText="Name/ Company*" value={contactMe.name}
                  showDanger={alert.checkExist("Name")}
                  onChange={i => setContactMe({ ...contactMe, name: i.target.value })} />
               <Input className="col-12" lblText="Email*" value={contactMe.email}
                  showDanger={alert.checkExist("Email")}
                  onChange={i => setContactMe({ ...contactMe, email: i.target.value })} />
               <Input className="col-12" lblText="Subject" value={contactMe.subject}
                  showDanger={alert.checkExist("Subject")}
                  onChange={i => setContactMe({ ...contactMe, subject: i.target.value })} />
               <TextArea keyVal="1" className="col-12" lblText="What would like to say?*" rows={5}
                  showDanger={alert.checkExist("Messege")}
                  value={contactMe.messege}
                  onChange={i => { setContactMe({ ...contactMe, messege: i.target.value }); }} />
               <div className="col-12">
                  <Alert className="col-12 mt-1" alert={alert} onClosed={() => setAlert(new AlertObj())} />
                  <Button children="Submit" className="btn-lg btn-green col-12 mt-1"
                     onClick={Submit}
                  />
               </div>
            </div>
         </Row>
      </Container >
   );
};
export default Contact;
