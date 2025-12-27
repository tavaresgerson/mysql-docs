## 7.5 Componentes do MySQL

7.5.1 Instalando e Desinstalando Componentes

7.5.2 Obtendo Informações sobre Componentes

7.5.3 Componentes do Log de Erros

7.5.4 Componentes de Atributo de Consulta

7.5.5 Componentes do Cronômetro

7.5.6 Componentes de Replicação

7.5.7 Componentes do Motor Multilíngue (MLE)

7.5.8 Componentes do Rastreador de Opções

O MySQL Server inclui uma infraestrutura baseada em componentes para ampliar as capacidades do servidor. Um componente fornece serviços que estão disponíveis para o servidor e outros componentes. (Em relação ao uso de serviços, o servidor é um componente, igual a outros componentes.) Os componentes interagem uns com os outros apenas através dos serviços que fornecem.

As distribuições do MySQL incluem vários componentes que implementam extensões do servidor:

* Componentes para configurar o registro de erros. Consulte a Seção 7.4.2, “O Log de Erros”, e a Seção 7.5.3, “Componentes do Log de Erros”.

* Um componente para verificar senhas. Consulte a Seção 8.4.4, “O Componente de Validação de Senhas”.

* Componentes de Keychain fornecem armazenamento seguro para informações sensíveis. Consulte a Seção 8.4.5, “O Keychain do MySQL”.

* Um componente que permite que aplicativos adicionem seus próprios eventos de mensagem ao log de auditoria. Consulte a Seção 8.4.7, “O Componente de Mensagem de Auditoria”.

* Um componente que implementa uma função carregável para acessar atributos de consulta. Consulte a Seção 11.6, “Atributos de Consulta”.

* Um componente para agendar tarefas que são executadas ativamente. Consulte a Seção 7.5.5, “Componente do Cronômetro”.

* Componentes para uso com a Replicação do MySQL e a Replicação do MySQL Group. Consulte a Seção 7.5.6, “Componentes de Replicação”.

* Um componente que permite a criação e uso de programas armazenados do MySQL escritos em JavaScript. Consulte a Seção 7.5.7, “Componente do Motor Multilíngue (MLE”)").

As variáveis de sistema e status implementadas por um componente são expostas quando o componente é instalado e têm nomes que começam com um prefixo específico do componente. Por exemplo, o componente de filtro de log de erro `log_filter_dragnet` implementa uma variável de sistema chamada `log_error_filter_rules`, cujo nome completo é `dragnet.log_error_filter_rules`. Para referenciar essa variável, use o nome completo.

As seções a seguir descrevem como instalar e desinstalar componentes e como determinar em tempo de execução quais componentes estão instalados e obter informações sobre eles.

Para informações sobre a implementação interna dos componentes, consulte a documentação do MySQL Server Doxygen, disponível em https://dev.mysql.com/doc/index-other.html. Por exemplo, se você pretende escrever seus próprios componentes, essas informações são importantes para entender como os componentes funcionam.