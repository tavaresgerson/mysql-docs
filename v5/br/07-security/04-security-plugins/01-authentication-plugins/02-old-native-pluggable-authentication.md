#### 6.4.1.2 Autenticação Plugável Native Antiga

O MySQL inclui dois plugins que implementam autenticação nativa; ou seja, autenticação baseada nos métodos de hash de senha usados antes da introdução da autenticação plugável. Esta seção descreve o `mysql_old_password`, que implementa autenticação contra a tabela de sistema `mysql.user` usando o método de hash de senha nativo mais antigo (pré-4.1). Para informações sobre o `mysql_native_password`, que implementa autenticação usando o método de hash de senha nativo, consulte Seção 6.4.1.1, “Autenticação Plugável Nativa”. Para informações sobre esses métodos de hash de senha, consulte Seção 6.1.2.4, “Hash de Senha no MySQL”.

Nota

Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método de hashing de senha nativo e devem ser evitadas. Senhas pré-4.1 estão desatualizadas e o suporte para elas (incluindo o plugin `mysql_old_password`) foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

A tabela a seguir mostra os nomes dos plugins no lado do servidor e no lado do cliente.

**Tabela 6.9 Nomes de plugins e bibliotecas para autenticação de senha nativa antiga**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha nativa antiga."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>[[<code>mysql_old_password</code>]]</td> </tr><tr> <td>Plugin no lado do cliente</td> <td>[[<code>mysql_old_password</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>Nenhum (os plugins são integrados)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação nativa antiga plugável:

- Instalando autenticação nativa antiga
- Usando autenticação nativa antiga

Para obter informações gerais sobre autenticação plugável no MySQL, consulte Seção 6.2.13, “Autenticação Plugável”.

##### Instalando autenticação nativa antiga plugável

O plugin `mysql_old_password` existe em formas de servidor e cliente:

- O plugin do lado do servidor é integrado ao servidor, não precisa ser carregado explicitamente e não pode ser desativado descarregando-o.

- O plugin do lado do cliente é integrado à biblioteca de clientes `libmysqlclient` e está disponível para qualquer programa vinculado ao `libmysqlclient`.

##### Usando autenticação nativa antiga plugável

Os programas clientes do MySQL podem usar a opção `--default-auth` para especificar o plugin `mysql_old_password` como uma dica sobre qual plugin do lado do cliente o programa pode esperar usar:

```sql
$> mysql --default-auth=mysql_old_password ...
```
