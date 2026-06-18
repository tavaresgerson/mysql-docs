### 3.3.1 Criando e selecionando um banco de dados

Se o administrador criar seu banco de dados para você ao configurar suas permissões, você pode começar a usá-lo. Caso contrário, você precisará criá-lo você mesmo:

```sql
mysql> CREATE DATABASE menagerie;
```

No Unix, os nomes dos bancos de dados são sensíveis a maiúsculas e minúsculas (ao contrário das palavras-chave do SQL), então você deve sempre se referir ao seu banco de dados como `menagerie`, e não como `Menagerie`, `MENAGERIE` ou alguma outra variante. Isso também vale para os nomes das tabelas. (No Windows, essa restrição não se aplica, embora você deva se referir aos bancos de dados e tabelas usando a mesma letra maiúscula em toda a consulta. No entanto, por várias razões, a melhor prática recomendada é sempre usar a mesma letra maiúscula que foi usada quando o banco de dados foi criado.)

Nota

Se você receber um erro como o ERRO 1044 (42000): Acesso negado para o usuário 'micah'@'localhost' ao banco de dados 'menagerie' ao tentar criar um banco de dados, isso significa que sua conta de usuário não tem os privilégios necessários para fazer isso. Discuta isso com o administrador ou consulte Seção 6.2, "Controle de Acesso e Gerenciamento de Contas".

Criar um banco de dados não o seleciona para uso; você deve fazer isso explicitamente. Para tornar `menagerie` o banco de dados atual, use esta instrução:

```sql
mysql> USE menagerie
Database changed
```

Seu banco de dados precisa ser criado apenas uma vez, mas você deve selecioná-lo para uso cada vez que iniciar uma sessão do **mysql**. Você pode fazer isso emitindo uma declaração `USE` como mostrado no exemplo. Alternativamente, você pode selecionar o banco de dados na linha de comando quando invocar **mysql**. Basta especificar seu nome após quaisquer parâmetros de conexão que você possa precisar fornecer. Por exemplo:

```sh
$> mysql -h host -u user -p menagerie
Enter password: ********
```

Importante

A palavra `menagerie` no comando mostrado acima **não** é sua senha. Se você quiser fornecer sua senha na linha de comando após a opção `-p`, você deve fazê-lo sem espaço intermediário (por exemplo, como `-ppassword`, e não como `-p password`). No entanto, colocar sua senha na linha de comando não é recomendado, pois isso a expõe ao espionamento por outros usuários conectados à sua máquina.

Nota

Você pode ver a qualquer momento qual banco de dados está selecionado atualmente usando `SELECT` `DATABASE()`.
