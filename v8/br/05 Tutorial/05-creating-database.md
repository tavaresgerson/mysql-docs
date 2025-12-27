### 5.3.1 Criando e selecionando uma base de dados

Se o administrador criar sua base de dados para você ao configurar suas permissões, você pode começar a usá-la. Caso contrário, você precisa criá-la você mesmo:

```
mysql> CREATE DATABASE menagerie;
```

No Unix, os nomes das bases de dados são sensíveis a maiúsculas e minúsculas (ao contrário das palavras-chave do SQL), então você deve sempre se referir à sua base de dados como `menagerie`, não como `Menagerie`, `MENAGERIE` ou alguma outra variante. Isso também é verdadeiro para os nomes das tabelas. (No Windows, essa restrição não se aplica, embora você deva se referir às bases de dados e tabelas usando a mesma letra maiúscula em toda a consulta. No entanto, por várias razões, a melhor prática recomendada é sempre usar a mesma letra maiúscula que foi usada ao criar a base de dados.)

::: info Nota

Se você receber um erro como ERROR 1044 (42000): Acesso negado para o usuário 'micah'@'localhost' à base de dados 'menagerie' ao tentar criar uma base de dados, isso significa que sua conta de usuário não tem os privilégios necessários para fazer isso.

:::

Criar uma base de dados não a seleciona para uso; você deve fazer isso explicitamente. Para tornar `menagerie` a base de dados atual, use esta declaração:

```
mysql> USE menagerie
Database changed
```

Sua base de dados precisa ser criada apenas uma vez, mas você deve selecioná-la para uso cada vez que iniciar uma sessão `mysql`. Você pode fazer isso emitindo uma declaração `USE` como mostrado no exemplo. Alternativamente, você pode selecionar a base de dados na linha de comando ao invocar o `mysql`. Basta especificar seu nome após quaisquer parâmetros de conexão que você possa precisar fornecer. Por exemplo:

```
$> mysql -h host -u user -p menagerie
Enter password: ********
```

Importante

`menagerie` no comando mostrado acima não é sua senha. Se você quiser fornecer sua senha na linha de comando após a opção `-p`, você deve fazê-lo sem espaço intermediário (por exemplo, como `-ppassword`, não como `-p password`). No entanto, colocar sua senha na linha de comando não é recomendado, porque isso a expõe ao espionamento por outros usuários conectados à sua máquina.

::: info Nota

Você pode ver a qualquer momento qual banco de dados está selecionado atualmente usando `SELECT` `DATABASE()`.