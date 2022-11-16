import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EditUser() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="name">
        <Form.Label>Username</Form.Label>
        <Form.Control
          {...register("name", { maxLength: 10 })}
          type="text"
        ></Form.Control>
      </Form.Group>
      <Form.Group controlId="spaceName">
        <Form.Label>Space Name</Form.Label>
        <Form.Control
          {...register("spaceName", { maxLength: 30 })}
          type="text"
        ></Form.Control>
      </Form.Group>
      <Form.Group controlId="spacePublished">
        <Form.Label>Space Active</Form.Label>
        <Form.Switch {...register("spacePublished")} type="radio"></Form.Switch>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
