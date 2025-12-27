#### 8.1.2.3 Senhas e Registro

As senhas podem ser escritas como texto simples em declarações SQL, como `CREATE USER`, `GRANT` e `SET PASSWORD`. Se essas declarações forem registradas pelo servidor MySQL como escritas, as senhas nelas se tornam visíveis para qualquer pessoa com acesso aos logs.

O registro de declarações evita a escrita de senhas como texto claro para as seguintes declarações:

```
CREATE USER ... IDENTIFIED BY ...
ALTER USER ... IDENTIFIED BY ...
SET PASSWORD ...
START REPLICA ... PASSWORD = ...
CREATE SERVER ... OPTIONS(... PASSWORD ...)
ALTER SERVER ... OPTIONS(... PASSWORD ...)
```

As senhas nessas declarações são reescritas para não aparecerem literalmente no texto da declaração escrita no log de consulta geral, log de consultas lentas e log binário. A reescrita não se aplica a outras declarações. Em particular, as declarações `INSERT` ou `UPDATE` para a tabela de sistema `mysql.user` que se referem a senhas literais são registradas como estão, então você deve evitar tais declarações. (A modificação direta das tabelas de concessão é desaconselhada, de qualquer forma.)

Para o log de consulta geral, a reescrita de senhas pode ser suprimida iniciando o servidor com a opção `--log-raw`. Por razões de segurança, essa opção não é recomendada para uso em produção. Para fins de diagnóstico, pode ser útil ver o texto exato das declarações recebidas pelo servidor.

Por padrão, o conteúdo dos arquivos de log de auditoria produzidos pelo plugin de log de auditoria não é criptografado e pode conter informações sensíveis, como o texto das declarações SQL. Por razões de segurança, os arquivos de log de auditoria devem ser escritos em um diretório acessível apenas ao servidor MySQL e aos usuários com um motivo legítimo para visualizar o log. Veja a Seção 8.4.6.3, “Considerações de Segurança de Auditoria do MySQL Enterprise”.

As declarações recebidas pelo servidor podem ser reescritas se um plugin de reescrita de consultas for instalado (veja Plugins de Reescrita de Consultas). Nesse caso, a opção `--log-raw` afeta o registro de declarações da seguinte forma:

* Sem `--log-raw`, o servidor registra a declaração devolvida pelo plugin de reescrita de consultas. Isso pode diferir da declaração recebida.

* Com `--log-raw`, o servidor registra a declaração original recebida.

Uma implicação da reescrita de senhas é que as declarações que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log geral de consultas, porque não é possível saber se elas estão livres de senhas. Use os casos que exigem o registro de todas as declarações, incluindo aquelas com erros, a opção `--log-raw`, tendo em mente que isso também ignora a reescrita de senhas.

A reescrita de senhas ocorre apenas quando se espera senhas em texto simples. Para declarações com sintaxe que esperam um valor de hash de senha, não ocorre reescrita. Se uma senha em texto simples for fornecida erroneamente para tal sintaxe, a senha é registrada como fornecida, sem reescrita.

Para proteger os arquivos de log contra exposição indevida, localize-os em um diretório que restrinja o acesso ao servidor e ao administrador da base de dados. Se o servidor registrar em tabelas na base de dados `mysql`, conceda acesso a essas tabelas apenas ao administrador da base de dados.

As réplicas armazenam a senha do servidor de origem da replicação em seu repositório de metadados de conexão, que, por padrão, é uma tabela na base de dados `mysql` chamada `slave_master_info`. O uso de um arquivo no diretório de dados para o repositório de metadados de conexão é agora desaconselhado, mas ainda possível (veja a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”). Garanta que o repositório de metadados de conexão possa ser acessado apenas pelo administrador da base de dados. Uma alternativa para armazenar a senha no repositório de metadados de conexão é usar a declaração `START REPLICA` ou `START GROUP_REPLICATION` para especificar credenciais para conectar-se à fonte.

Use um modo de acesso restrito para proteger backups de banco de dados que incluam tabelas de registro ou arquivos de registro contendo senhas.