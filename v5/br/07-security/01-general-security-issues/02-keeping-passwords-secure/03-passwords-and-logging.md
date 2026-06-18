#### 6.1.2.3 Senhas e registro

As senhas podem ser escritas como texto simples em declarações SQL, como `CREATE USER`, `GRANT`, `SET PASSWORD` e declarações que invocam a função `PASSWORD()`. Se essas declarações forem registradas pelo servidor MySQL como escritas, as senhas nelas se tornam visíveis para qualquer pessoa com acesso aos logs.

O registro de declarações evita a escrita de senhas como texto claro para as seguintes declarações:

```sql
CREATE USER ... IDENTIFIED BY ...
ALTER USER ... IDENTIFIED BY ...
GRANT ... IDENTIFIED BY ...
SET PASSWORD ...
SLAVE START ... PASSWORD = ...
CREATE SERVER ... OPTIONS(... PASSWORD ...)
ALTER SERVER ... OPTIONS(... PASSWORD ...)
```

As senhas nessas declarações são reescritas para não aparecerem literalmente no texto da declaração escrita no log de consulta geral, no log de consultas lentas e no log binário. A reescrita não se aplica a outras declarações. Em particular, as declarações `INSERT` ou `UPDATE` para a tabela de sistema `mysql.user` que se referem a senhas literais são registradas como estão, portanto, você deve evitar tais declarações. (A modificação direta das tabelas de concessão é desaconselhada, de qualquer forma.)

Para o log de consulta geral, a reescrita da senha pode ser suprimida iniciando o servidor com a opção `--log-raw`. Por razões de segurança, essa opção não é recomendada para uso em produção. Para fins de diagnóstico, pode ser útil ver o texto exato das declarações recebidas pelo servidor.

O conteúdo do arquivo de registro de auditoria produzido pelo plugin de registro de auditoria não é criptografado. Por razões de segurança, este arquivo deve ser escrito em um diretório acessível apenas ao servidor MySQL e aos usuários que tenham um motivo legítimo para visualizar o log. Consulte Seção 6.4.5.3, “Considerações de segurança de auditoria do MySQL Enterprise”.

As declarações recebidas pelo servidor podem ser reescritas se um plugin de reescrita de consulta estiver instalado (consulte Plugins de reescrita de consulta). Nesse caso, a opção `--log-raw` afeta o registro de declarações da seguinte forma:

- Sem `--log-raw`, o servidor registra a declaração devolvida pelo plugin de reescrita de consultas. Isso pode diferir da declaração recebida.

- Com `--log-raw`, o servidor registra a declaração original conforme recebida.

Uma implicação da reescrita de senhas é que as declarações que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log de consulta geral, porque não é possível saber se elas estão livres de senhas. Casos de uso que exigem o registro de todas as declarações, incluindo aquelas com erros, devem usar a opção `--log-raw`, tendo em mente que isso também ignora a reescrita de senhas.

A reescrita da senha ocorre apenas quando se espera uma senha em texto simples. Para declarações com sintaxe que esperam um valor de hash de senha, não ocorre reescrita. Se uma senha em texto simples for fornecida erroneamente para tal sintaxe, a senha é registrada como fornecida, sem reescrita. Por exemplo, a seguinte declaração é registrada conforme mostrado porque um valor de hash de senha é esperado:

```sql
CREATE USER 'user1'@'localhost' IDENTIFIED BY PASSWORD 'not-so-secret';
```

Para proteger os arquivos de registro contra exposição indevida, localizá-los em um diretório que restrinja o acesso ao administrador do servidor e do banco de dados. Se o servidor registrar em tabelas no banco de dados `mysql`, conceda acesso a essas tabelas apenas ao administrador do banco de dados.

As réplicas armazenam a senha da fonte de replicação no repositório de informações da fonte, que pode ser um arquivo ou uma tabela (consulte Seção 16.2.4, “Repositórios de Log de Relógio e Metadados de Replicação”). Certifique-se de que o repositório possa ser acessado apenas pelo administrador do banco de dados. Uma alternativa para armazenar a senha em um arquivo é usar a instrução `START SLAVE` para especificar as credenciais para conectar-se à fonte.

Use um modo de acesso restrito para proteger backups de banco de dados que incluem tabelas de log ou arquivos de log contendo senhas.
