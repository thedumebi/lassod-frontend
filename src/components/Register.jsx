import React, { useState } from "react";
import ErrorLabel from "./ErrorLabel";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const Register = () => {
  const fieldState = {
    value: "",
    valid: true,
    typeMismatch: false,
    alreadySubmitted: false,
    errMsg: "",
  };

  const [info, setInfo] = useState({
    email: {
      ...fieldState,
      fieldName: "Email Address",
      required: true,
      requiredTxt: "This field is required",
      formatErrorTxt: "Incorrect email format",
      submittedErrorTxt: "You have already submitted a Dream Job",
    },
    dreamJob: {
      ...fieldState,
      fieldName: "Dream Job",
      required: true,
      requiredTxt: "This field is required",
    },
    allFieldsValid: false,
    submitMessage: "",
  });

  const getCookie = (name) => {
    const match = document.cookie.match(
      RegExp("(?:^|;\\s*)" + name + "=([^;]*)")
    );
    return match ? match[1] : null;
  };

  const reduceFormValues = (formElements) => {
    const arrElements = Array.prototype.slice.call(formElements);
    const formValues = arrElements
      .filter((elem) => elem.name.length > 0)
      .map((x) => {
        const { typeMismatch } = x.validity;
        const { alreadySubmitted } = x.validity;
        const { name, type, value } = x;
        return {
          name,
          type,
          typeMismatch,
          alreadySubmitted,
          value,
          valid: x.checkValidity(),
        };
      })
      .reduce((acc, currVal) => {
        const { value, valid, typeMismatch, alreadySubmitted } = currVal;
        const {
          fieldName,
          requiredTxt,
          formatErrorTxt,
          submittedErrorTxt,
        } = info[currVal.name];
        acc[currVal.name] = {
          value,
          valid,
          typeMismatch,
          alreadySubmitted,
          fieldName,
          requiredTxt,
          formatErrorTxt,
          submittedErrorTxt,
        };
        return acc;
      }, {});
    return formValues;
  };

  const checkAllFieldsValid = (formValues) => {
    return !Object.keys(formValues)
      .map((x) => formValues[x])
      .some((field) => !field.valid);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const formValues = reduceFormValues(form.elements);
    const allFieldsValid = checkAllFieldsValid(formValues);
    console.log(formValues);
    const email = getCookie("email");
    if (email === formValues.email.value) {
      formValues.email.alreadySubmitted = true;
      setInfo({
        ...{
          ...formValues,
          email: { ...formValues.email, value: "", valid: false },
          dreamJob: { ...formValues.dreamJob, value: "" },
        },
        allFieldsValid: false,
      });
    } else {
      setInfo({ ...formValues, allFieldsValid });
      document.cookie = `email=${formValues.email.value}`;
    }
  };

  const renderEmailValidationError = info.email.valid ? (
    ""
  ) : (
    <ErrorLabel
      txtLbl={
        info.email.typeMismatch
          ? info.email.formatErrorTxt
          : info.email.alreadySubmitted
          ? info.email.submittedErrorTxt
          : info.email.requiredTxt
      }
    />
  );

  const renderJobValidationError = info.dreamJob.valid ? (
    ""
  ) : (
    <ErrorLabel txtLbl={info.dreamJob.requiredTxt} />
  );

  const successFormDisplay = info.allFieldsValid ? "block" : "none";

  return (
    <div className="content">
      <h1>Register Your Dream Job</h1>
      <p>kindly provide your email and dream job</p>
      <p style={{ display: successFormDisplay, color: "green" }}>
        Dream Job Successfully Saved
      </p>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <Form id="validate" onSubmit={handleSubmit} noValidate>
              <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Your Email Address"
                  name="email"
                  required
                />
                {renderEmailValidationError}
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="select">Dream Job</Form.Label>
                <Form.Control as="select" name="dreamJob" required>
                  <option value="">Select Your Dream Job</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="FullStack Engineer">FullStack Engineer</option>
                </Form.Control>
                {renderJobValidationError}
              </Form.Group>

              <Button type="submit" variant="primary">
                SUBMIT
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
