import { Input, Button, Form } from "@heroui/react";
import { FormEvent, useEffect, useRef, useState } from "react";

import { SendIcon } from "@/components/icons/ChatIcons";

type Props = {
  isLoading: boolean;
  onSubmit: (values: MessageFormValues) => void;
};

export type MessageFormValues = {
  message: string;
};

const MessageForm = ({ onSubmit, isLoading }: Props) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Form
      className="flex flex-row gap-2 max-w-3xl w-full mx-auto"
      onSubmit={(e: FormEvent) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget as HTMLFormElement);
        const values = Object.fromEntries(data) as MessageFormValues;

        onSubmit(values);

        setInput("");
        setTimeout(() => inputRef.current?.focus(), 0);
      }}
    >
      <Input
        ref={inputRef}
        fullWidth
        disabled={isLoading}
        name="message"
        placeholder="Écrivez votre message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        isIconOnly
        color="primary"
        isDisabled={!input.trim().length || isLoading}
        isLoading={isLoading}
        type="submit"
      >
        <SendIcon />
      </Button>
    </Form>
  );
};

export default MessageForm;
