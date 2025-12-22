## 7.5 Componentes do MySQL

O MySQL Server inclui uma infraestrutura baseada em componentes para estender os recursos do servidor. Um componente fornece serviços que estão disponíveis para o servidor e outros componentes.

As distribuições do MySQL incluem vários componentes que implementam extensões de servidor:

- Componentes para a configuração do registo de erros. Ver secção 7.4.2, "O registo de erros" e secção 7.5.3, "Componentes de registo de erros".
- Componente de verificação de senhas, ver ponto 8.4.3, "Componente de validação de senhas".
- Os componentes de Keyring fornecem armazenamento seguro para informações confidenciais.
- Um componente que permite às aplicações adicionar os seus próprios eventos de mensagem ao registo de auditoria.
- Um componente que implementa uma função carregável para aceder aos atributos de consulta.
- Componente de programação que executa ativamente as tarefas; ver secção 7.5.5, "Componente de programação".

As variáveis de sistema e de status implementadas por um componente são expostas quando o componente é instalado e têm nomes que começam com um prefixo específico do componente. Por exemplo, o componente de filtro de registro de erro `log_filter_dragnet` implementa uma variável de sistema chamada `log_error_filter_rules`, cujo nome completo é `dragnet.log_error_filter_rules`. Para se referir a esta variável, use o nome completo.

As seções a seguir descrevem como instalar e desinstalar componentes, e como determinar no tempo de execução quais componentes estão instalados e obter informações sobre eles.

Para obter informações sobre a implementação interna dos componentes, consulte a documentação do MySQL Server Doxygen, disponível em \[<https://dev.mysql.com/doc/index-other.html>]<https://dev.mysql.com/doc/index-other.html> Por exemplo, se você pretende escrever seus próprios componentes, essa informação é importante para entender como os componentes funcionam.
