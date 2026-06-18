#### 6.4.1.1 Autenticação Pluggable Nativa

O MySQL inclui dois plugins que implementam autenticação nativa; ou seja, autenticação baseada nos métodos de hash de senha usados antes da introdução da autenticação plugável. Esta seção descreve o `mysql_native_password`, que implementa a autenticação contra a tabela de sistema `mysql.user` usando o método de hash de senha nativo. Para informações sobre o `mysql_old_password`, que implementa a autenticação usando o método de hash de senha nativo mais antigo (pré-4.1), consulte Seção 6.4.1.2, “Autenticação Nativa Antiga Plugável”. Para informações sobre esses métodos de hash de senha, consulte Seção 6.1.2.4, “Hash de Senha no MySQL”.

A tabela a seguir mostra os nomes dos plugins no lado do servidor e no lado do cliente.

**Tabela 6.8 Nomes de plugins e bibliotecas para autenticação de senha nativa**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha nativa."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Plugin no lado do cliente</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Arquivo da biblioteca</td> <td>Nenhum (os plugins são integrados)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável nativa:

- Instalando Autenticação Pluggable Nativo
- Usando Autenticação Pluggable Nativo

Para obter informações gerais sobre autenticação plugável no MySQL, consulte Seção 6.2.13, “Autenticação Plugável”.

##### Instalando Autenticação Native Pluggable

O plugin `mysql_native_password` existe em formas de servidor e cliente:

- O plugin do lado do servidor é integrado ao servidor, não precisa ser carregado explicitamente e não pode ser desativado descarregando-o.

- O plugin do lado do cliente é integrado à biblioteca de clientes `libmysqlclient` e está disponível para qualquer programa vinculado ao `libmysqlclient`.

##### Usando Autenticação Native Pluggable

Os programas clientes do MySQL usam `mysql_native_password` por padrão. A opção `--default-auth` pode ser usada como uma dica sobre qual plugin do lado do cliente o programa pode esperar que seja usado:

```sh
$> mysql --default-auth=mysql_native_password ...
```
