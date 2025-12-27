#### 15.7.4.3. Instalação de Componentes

```
INSTALL COMPONENT component_name  [, component_name ...
     [SET variable = expr [, variable = expr] ...]

  variable: {
    {GLOBAL | @@GLOBAL.} [component_prefix.]system_var_name
  | {PERSIST | @@PERSIST.} [component_prefix.]system_var_name
}
```

Esta declaração instala um ou mais componentes, que se tornam ativos imediatamente. Um componente fornece serviços que estão disponíveis para o servidor e outros componentes; consulte a Seção 7.5, “Componentes MySQL”. A declaração `INSTALL COMPONENT` requer o privilégio `INSERT` para a tabela de sistema `mysql.component` porque adiciona uma linha a essa tabela para registrar o componente.

Exemplo:

```
INSTALL COMPONENT 'file://component1', 'file://component2';
```

Um componente é nomeado usando um URN que começa com `file://` e indica o nome base do arquivo de biblioteca que implementa o componente, localizado no diretório nomeado pela variável de sistema `plugin_dir`. Os nomes dos componentes não incluem nenhum sufixo de nome de arquivo dependente da plataforma, como `.so` ou `.dll`. (Esses detalhes de nomeação estão sujeitos a alterações porque a interpretação do nome do componente é realizada por um serviço e a infraestrutura do componente permite substituir a implementação de serviço padrão por implementações alternativas.)

A declaração `INSTALL COMPONENT` permite definir os valores das variáveis de sistema do componente ao instalar um ou mais componentes. A cláusula `SET` permite que você especifique os valores das variáveis com precisão quando eles são necessários, sem o inconveniente ou as limitações associadas a outras formas de atribuição. Especificamente, você também pode definir variáveis de componente com essas alternativas:

* Na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções, mas isso envolve uma reinicialização do servidor. Os valores só entram em vigor quando você instala o componente. Você pode especificar um nome de variável inválido para um componente na linha de comando sem desencadear um erro.

Dinamicamente, enquanto o servidor estiver em execução, por meio da instrução `SET`, que permite modificar o funcionamento do servidor sem precisar parar e reiniciá-lo. Não é permitido definir uma variável somente de leitura.

A cláusula opcional `SET` aplica um valor ou valores apenas ao componente especificado na instrução `INSTALL COMPONENT`, e não a todas as instalações subsequentes desse componente. `SET GLOBAL|PERSIST` funciona para todos os tipos de variáveis, incluindo variáveis somente de leitura, sem precisar reiniciar o servidor. Uma variável do sistema de componentes que você definir usando `INSTALL COMPONENT` tem precedência sobre qualquer valor conflitante proveniente da linha de comando ou de um arquivo de opção.

Exemplo:

```
INSTALL COMPONENT 'file://component1', 'file://component2'
    SET GLOBAL component1.var1 = 12 + 3, PERSIST component2.var2 = 'strings';
```

Omitindo `PERSIST` ou `GLOBAL` é equivalente a especificar `GLOBAL`.

Especificar `PERSIST` para qualquer variável em `SET` executa silenciosamente `SET PERSIST_ONLY` imediatamente após o `INSTALL COMPONENT` carregar os componentes, mas antes de atualizar a tabela `mysql.component`. Se `SET PERSIST_ONLY` falhar, o servidor descarrega todos os componentes novos carregados anteriormente sem persistir nada na `mysql.component`.

A cláusula `SET` aceita apenas nomes válidos de variáveis do componente que está sendo instalado e emite uma mensagem de erro para todos os nomes inválidos. Subconsultas, funções armazenadas e funções agregadas não são permitidas como parte da expressão de valor. Se você instalar um único componente, não é necessário prefixar o nome da variável com o nome do componente.

Observação

Embora a especificação de um valor variável usando a cláusula `SET` seja semelhante à da linha de comando — ela é disponível imediatamente na hora do registro da variável — há uma diferença distinta na forma como a cláusula `SET` lida com valores *numéricos inválidos* para variáveis booleanas. Por exemplo, se você definir uma variável booleana para 11 (`component1.boolvar = 11`), você verá o seguinte comportamento:

* A cláusula `SET` retorna true
* A linha de comando retorna false (11 não é nem ON nem 1)

Se ocorrer algum erro, a declaração falha e não tem efeito. Por exemplo, isso acontece se o nome de um componente for incorreto, um componente nomeado não existir ou já estiver instalado, ou se a inicialização do componente falhar.

Um serviço de carregamento lida com o carregamento de componentes, o que inclui adicionar componentes instalados à tabela de sistema `mysql.component` que serve como um registro. Para reinicializações subsequentes do servidor, quaisquer componentes listados em `mysql.component` são carregados pelo serviço de carregamento durante a sequência de inicialização. Isso ocorre mesmo se o servidor for iniciado com a opção `--skip-grant-tables`.

Se um componente depende de serviços não presentes no registro e você tentar instalar o componente sem também instalar o componente ou componentes que fornecem os serviços nos quais ele depende, um erro ocorre:

```
ERROR 3527 (HY000): Cannot satisfy dependency for service 'component_a'
required by component 'component_b'.
```

Para evitar esse problema, instale todos os componentes na mesma declaração ou instale o componente dependente após instalar quaisquer componentes nos quais ele depende.

Nota

Para componentes de chave, não use `INSTALL COMPONENT`. Em vez disso, configure o carregamento de componentes de chave usando um arquivo de manifesto. Veja a Seção 8.4.5.2, “Instalação de Componentes de Chave”.