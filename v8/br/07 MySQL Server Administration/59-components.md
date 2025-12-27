## 7.5 Componentes do MySQL

O MySQL Server inclui uma infraestrutura baseada em componentes para ampliar as capacidades do servidor. Um componente fornece serviços que estão disponíveis para o servidor e outros componentes. (Em relação ao uso dos serviços, o servidor é um componente, igual a outros componentes.) Os componentes interagem uns com os outros apenas através dos serviços que fornecem.

As distribuições do MySQL incluem vários componentes que implementam extensões do servidor:

* Componentes para configurar o registro de erros. Consulte a Seção 7.4.2, “O Log de Erros”, e a Seção 7.5.3, “Componentes do Log de Erros”.
* Um componente para verificar senhas. Consulte a Seção 8.4.3, “O Componente de Validação de Senhas”.
* Componentes de cartela de chaves fornecem armazenamento seguro para informações sensíveis. Consulte  a Seção 8.4.4, “A Cartela de Chaves MySQL”.
* Um componente que permite que as aplicações adicionem seus próprios eventos de mensagem ao log de auditoria. Consulte a Seção 8.4.6, “O Componente de Mensagem de Auditoria”.
* Um componente que implementa uma função carregável para acessar atributos de consulta. Consulte  a Seção 11.6, “Atributos de Consulta”.
* Um componente para agendar tarefas que são executadas ativamente. Consulte a Seção 7.5.5, “Componente de Cronograma”.

As variáveis de sistema e status implementadas por um componente são exibidas quando o componente é instalado e têm nomes que começam com um prefixo específico do componente. Por exemplo, o componente de filtro de log de erro `log_filter_dragnet` implementa uma variável de sistema chamada `log_error_filter_rules`, cujo nome completo é `dragnet.log_error_filter_rules`. Para referenciar essa variável, use o nome completo.

As seções a seguir descrevem como instalar e desinstalar componentes e como determinar em tempo de execução quais componentes estão instalados e obter informações sobre eles.

Para informações sobre a implementação interna dos componentes, consulte a documentação do MySQL Server Doxygen, disponível em https://dev.mysql.com/doc/index-other.html. Por exemplo, se você pretende escrever seus próprios componentes, essas informações são importantes para entender como os componentes funcionam.