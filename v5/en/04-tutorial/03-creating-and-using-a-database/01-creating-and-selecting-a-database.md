### 3.3.1 Criando e Selecionando um Database

Se o administrador criar o seu Database para você ao configurar suas permissões, você pode começar a usá-lo. Caso contrário, você precisa criá-lo você mesmo:

```sql
mysql> CREATE DATABASE menagerie;
```

No Unix, nomes de Database são *case-sensitive* (diferentes das palavras-chave SQL), então você deve sempre se referir ao seu Database como `menagerie`, e não como `Menagerie`, `MENAGERIE`, ou alguma outra variante. Isso também se aplica a nomes de table. (No Windows, essa restrição não se aplica, embora você deva se referir a Databases e tables usando o mesmo padrão de maiúsculas/minúsculas ao longo de uma dada Query. No entanto, por uma variedade de razões, a melhor prática recomendada é sempre usar o mesmo padrão de maiúsculas/minúsculas que foi usado quando o Database foi criado.)

Note

Se você receber um erro como ERROR 1044 (42000): Access denied for user 'micah'@'localhost' to database 'menagerie' ao tentar criar um Database, isso significa que sua conta de usuário não possui os privilégios necessários para fazê-lo. Discuta isso com o administrador ou consulte [Seção 6.2, “Access Control and Account Management”](access-control.html "6.2 Access Control and Account Management").

Criar um Database não o seleciona para uso; você deve fazer isso explicitamente. Para tornar `menagerie` o Database atual, use esta statement:

```sql
mysql> USE menagerie
Database changed
```

Seu Database precisa ser criado apenas uma vez, mas você deve selecioná-lo para uso toda vez que iniciar uma [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") session. Você pode fazer isso emitindo uma [`USE`](use.html "13.8.4 USE Statement") statement, conforme mostrado no exemplo. Alternativamente, você pode selecionar o Database na linha de comando ao invocar o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"). Basta especificar o nome após quaisquer parâmetros de conexão que você possa precisar fornecer. Por exemplo:

```sql
$> mysql -h host -u user -p menagerie
Enter password: ********
```

Importante

`menagerie` no comando mostrado **não** é sua *password*. Se você quiser fornecer sua *password* na linha de comando após a opção `-p`, você deve fazê-lo sem espaço intermediário (por exemplo, como `-ppassword`, e não como `-p password`). No entanto, inserir sua *password* na linha de comando não é recomendado, pois isso a expõe à espionagem de outros usuários logados em sua máquina.

Note

Você pode ver a qualquer momento qual Database está atualmente selecionado usando [`SELECT`](select.html "13.2.9 SELECT Statement") [`DATABASE()`](information-functions.html#function_database).