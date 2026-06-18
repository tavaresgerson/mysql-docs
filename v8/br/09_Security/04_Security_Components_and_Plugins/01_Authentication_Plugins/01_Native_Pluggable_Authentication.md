#### 8.4.1.1 Autenticação Pluggable nativa

O MySQL inclui um plugin `mysql_native_password` que implementa a autenticação nativa; ou seja, a autenticação baseada no método de hash de senha utilizado antes da introdução da autenticação plugável.

Nota

O plugin de autenticação `mysql_native_password` está desatualizado a partir do MySQL 8.0.34, desabilitado por padrão no MySQL 8.4 e removido a partir do MySQL 9.0.0.

A tabela a seguir mostra os nomes dos plugins no lado do servidor e no lado do cliente.

**Tabela 8.16 Nomes de plugins e bibliotecas para autenticação de senha nativa**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha nativa."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>[[<code>mysql_native_password</code>]]</td> </tr><tr> <td>Plugin no lado do cliente</td> <td>[[<code>mysql_native_password</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>Nenhum (os plugins são integrados)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável nativa:

- Instalando Autenticação Native Pluggable
- Usando Autenticação Native Pluggable

Para obter informações gerais sobre autenticação plugável no MySQL, consulte a Seção 8.2.17, “Autenticação Plugável”.

##### Instalando Autenticação Native Pluggable

O plugin `mysql_native_password` existe em formulários de servidor e cliente:

- O plugin do lado do servidor é integrado ao servidor, não precisa ser carregado explicitamente e não pode ser desativado descarregando-o.

- O plugin do lado do cliente é integrado à biblioteca de cliente `libmysqlclient` e está disponível para qualquer programa vinculado a `libmysqlclient`.

##### Usando Autenticação Native Pluggable

Os programas clientes do MySQL usam `mysql_native_password` por padrão. A opção `--default-auth` pode ser usada como uma dica sobre qual plugin do lado do cliente o programa pode esperar usar:

```
$> mysql --default-auth=mysql_native_password ...
```
