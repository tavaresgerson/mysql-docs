### 5.3.1 Criação e selecção de uma base de dados

Se o administrador criar o banco de dados para você ao configurar suas permissões, você pode começar a usá-lo. Caso contrário, você precisa criá-lo sozinho:

```
mysql> CREATE DATABASE menagerie;
```

No Unix, os nomes de banco de dados são sensíveis a maiúsculas e minúsculas (ao contrário das palavras-chave SQL), então você deve sempre se referir ao seu banco de dados como `menagerie`, não como `Menagerie`, `MENAGERIE`, ou alguma outra variante. Isso também é verdade para nomes de tabelas. (No Windows, essa restrição não se aplica, embora você deve se referir a bancos de dados e tabelas usando o mesmo maiúsculo ao longo de uma determinada consulta. No entanto, por uma variedade de razões, a melhor prática recomendada é sempre usar o mesmo maiúsculo que foi usado quando o banco de dados foi criado.)

::: info Note

Se você receber um erro como ERROR 1044 (42000): acesso negado para o usuário 'micah'@'localhost' ao banco de dados 'menagerie' ao tentar criar um banco de dados, isso significa que sua conta de usuário não tem os privilégios necessários para fazê-lo. Discuta isso com o administrador ou consulte a Seção 8.2, Controlo de acesso e gerenciamento de conta.

:::

Criar um banco de dados não o seleciona para uso; você deve fazer isso explicitamente. Para fazer `menagerie` o banco de dados atual, use esta instrução:

```
mysql> USE menagerie
Database changed
```

Seu banco de dados precisa ser criado apenas uma vez, mas você deve selecioná-lo para uso cada vez que você iniciar uma sessão `mysql`. Você pode fazer isso emitindo uma instrução `USE` como mostrado no exemplo. Alternativamente, você pode selecionar o banco de dados na linha de comando quando você invocar `mysql`. Basta especificar seu nome após quaisquer parâmetros de conexão que você possa precisar fornecer. Por exemplo:

```
$> mysql -h host -u user -p menagerie
Enter password: ********
```

Importância

Se você quiser fornecer sua senha na linha de comando após a opção \[`-p`], você deve fazê-lo sem espaço intermediário (por exemplo, como \[`-ppassword`], não como \[`-p password`]]). No entanto, colocar sua senha na linha de comando não é recomendado, porque isso a expõe a espionagem por outros usuários conectados em sua máquina.

::: info Note

Você pode ver a qualquer momento qual banco de dados está atualmente selecionado usando `SELECT` `DATABASE()`.

:::
