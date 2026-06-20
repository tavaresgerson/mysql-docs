## 24.6 Tabelas de Controle de Conexão do SCHEMA DE INFORMAÇÃO

As seções a seguir descrevem as tabelas `INFORMATION_SCHEMA` associadas ao plugin `connection_control`.

### 24.6.1 Informações do esquema de controle de conexão da tabela de referência

A tabela a seguir resume as tabelas de controle de conexão `INFORMATION_SCHEMA`. Para mais detalhes, consulte as descrições das tabelas individuais.

**Tabela 24.9 Tabelas de Controle de Conexão do Schema de Informação**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA connection control tables."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Table Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th><code>CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS</code></th> <td>Número atual de tentativas consecutivas de conexão falhadas por conta</td> <td>5.7.17</td> </tr></tbody></table>

### 24.6.2 A tabela INFORMATION\_SCHEMA CONNECTION\_CONTROL\_FAILED\_LOGIN\_ATTEMPTS

Esta tabela fornece informações sobre o número atual de tentativas de conexão consecutivas falhadas por conta (combinação de usuário/host). A tabela foi adicionada no MySQL 5.7.17.

`CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` tem essas colunas:

* `USERHOST`

A combinação de usuário/anfitrião que indica uma conta que teve tentativas de conexão malsucedidas, no formato `'user_name'@'host_name'`.

* `FAILED_ATTEMPTS`

O número atual de tentativas consecutivas de conexão falhadas para o valor `USERHOST`. Este número conta todas as tentativas falhadas, independentemente de elas terem sido adiadas. O número de tentativas para as quais o servidor adicionou um atraso à sua resposta é a diferença entre o valor do sistema `FAILED_ATTEMPTS` e o valor da variável do sistema `connection_control_failed_connections_threshold`.

#### Notas

* O plugin `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` deve ser ativado para que esta tabela esteja disponível, e o plugin `CONNECTION_CONTROL` deve ser ativado ou o conteúdo da tabela ficará sempre vazio. Veja a Seção 6.4.2, “Plugins de Controle de Conexão”.

* A tabela contém linhas apenas para contas que tiveram uma ou mais tentativas consecutivas de conexão falha sem uma tentativa subsequente bem-sucedida. Quando uma conta se conecta com sucesso, seu contagem de conexão falha é zerada e o servidor remove qualquer linha correspondente à conta.

* Atribuir um valor à variável de sistema `connection_control_failed_connections_threshold` no momento da execução reescreve todos os contadores acumulados de falha de conexão para zero, o que faz com que a tabela fique vazia.