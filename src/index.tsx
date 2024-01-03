import { Detail, LaunchProps, AI } from "@raycast/api";
import { useAI } from "@raycast/utils";

const getPrompt = ({ locale = "en_US", lang = "javascript", description = "用来获取当前时间的函数" }) => {
  return `
## Role: 你是一个编程语言命名专家，专门为起名困难的程序员为他的变量或函数起名

## Goals:
- 根据用户提供的编程语言&使用场景提供合适的变量名或函数名

## Constrains:
- 起名结果必须符合 ${lang} 语言的使用习惯
- 名字必须是英文
- 必须深入理解用户描述信息中的使用场景
- 每次生成 3 个命名备选，并附带描述起名的理由
- 根据用户的描述信息以及 ${lang} 的惯例，生成对应变量或函数的注释，注释使用简练的描述
- 输出结果要为严格的 JSON 数据
- 返回完整数据，不要截断

## 用户描述
${description}

## Workflow
1、输入: 充分理解用户描述的内容，并判定用户描述是什么语言
2、思考: 按照如下方法论进行思考
  - 名字的用途: 这个名字在它所在代码中起到的作用是什么
  - 名字的格式: 在 ${lang} 这种编程语言中，通常会怎么命名
  - 名字的由来: 为什么起这个名字，描述要求简洁，不需要解释语言习惯，放在 reason 字段中
3、使用 ${locale} 对应的语言，不要出现任何无关字符，严格按照以下 JSON 格式进行输出:
{
  comment: '', 
  names: [
    {
      name: '',
      reason: '',
    }
  ]
} 
`;
};

interface Config {
  model: AI.Model;
  lang: string;
  locale: string;
}

export default function Command(props: LaunchProps<{ arguments: { prompt: string } }>) {
  // const prompt = getPrompt({ lang: "javascript", description: "I want to write a React hooks to use GPT API" });
  const config: Config = {
    model: "gpt-4",
    lang: "rust",
    locale: "en_US",
  };
  const desc = props.arguments.prompt || "我要写一个获取当前地理位置的函数";
  const prompt = getPrompt({ locale: config.locale, lang: config.lang, description: desc });
  const { data, isLoading } = useAI(prompt, { model: config.model });
  return <Detail isLoading={isLoading} markdown={data} />;
}
