## 3.8 Atualizando o MySQL com o Repositório MySQL Yum

Para plataformas com suporte ao Yum (consulte a Seção 2.5.1, "Instalando o MySQL no Linux usando o Repositório Yum do MySQL", para uma lista), você pode realizar uma atualização in-place para o MySQL (ou seja, substituir a versão antiga e, em seguida, executar a nova versão usando os arquivos de dados antigos) com o repositório Yum do MySQL.

Notas

* Antes de realizar qualquer atualização no MySQL, siga cuidadosamente as instruções do Capítulo 3, *Atualizando o MySQL*. Entre outras instruções discutidas, é especialmente importante fazer backup do seu banco de dados antes da atualização.

* As instruções a seguir pressupõem que você instalou o MySQL com o repositório MySQL Yum ou com um pacote RPM diretamente baixado da página de download do MySQL Developer Zone [(https://dev.mysql.com/downloads/)]; se não for esse o caso, siga as instruções na Reposição de uma distribuição de terceiros do MySQL usando o repositório MySQL Yum.

1. ### Selecionando uma série-alvo

Por padrão, o repositório MySQL Yum atualiza o MySQL para a versão mais recente na série de lançamento que você escolheu durante a instalação (consulte Selecionar uma Série de Lançamento para obter detalhes), o que significa, por exemplo, que uma instalação 5.7.x *não* é atualizada automaticamente para uma versão 8.0.x. Para atualizar para outra série de lançamento, você deve primeiro desativar o subrepositório para a série que foi selecionada (por padrão, ou por você mesmo) e ativar o subrepositório para a série do seu alvo. Para fazer isso, consulte as instruções gerais fornecidas em Selecionar uma Série de Lançamento. Para atualização de MySQL 5.7 para 8.0, realize o *reverso* dos passos ilustrados em Selecionar uma Série de Lançamento, desativando o subrepositório para a série MySQL 5.7 e ativando-o para a série MySQL 8.0.

Como regra geral, para fazer uma atualização de uma série de lançamento para outra, vá para a próxima série em vez de pular uma série. Por exemplo, se você está atualmente executando o MySQL 5.6 e deseja fazer uma atualização para 8.0, faça uma atualização para o MySQL 5.7 primeiro antes de fazer a atualização para 8.0.

Importante

Para informações importantes sobre a atualização do MySQL 5.7 para 8.0, consulte [Atualizando do MySQL 5.7 para 8.0][(upgrading-from-previous-series.html "3.5 Changes in MySQL 8.0")].

2. ### Atualização do MySQL

Atualize o MySQL e seus componentes pelo seguinte comando, para plataformas que não são habilitadas para dnf:

   ```
   sudo yum update mysql-server
   ```

Para plataformas que são habilitadas para dnf:

   ```
   sudo dnf upgrade mysql-server
   ```

Como alternativa, você pode atualizar o MySQL dizendo ao Yum para atualizar tudo no seu sistema, o que pode levar um tempo consideravelmente maior. Para plataformas que não são habilitadas para dnf:

   ```
   sudo yum update
   ```

Para plataformas que são habilitadas para dnf:

   ```
   sudo dnf upgrade
   ```

3. ### Reiniciar o MySQL

O servidor MySQL é sempre reiniciado após uma atualização pelo Yum. Antes do MySQL 8.0.16, execute **mysql_upgrade** após o reinício do servidor para verificar e, possivelmente, resolver quaisquer incompatibilidades entre os dados antigos e o software atualizado. **mysql_upgrade** também realiza outras funções; para detalhes, consulte a Seção 6.4.5, “mysql_upgrade — Verificar e atualizar tabelas MySQL”. A partir do MySQL 8.0.16, este passo não é necessário, pois o servidor realiza todas as tarefas anteriormente tratadas pelo **mysql_upgrade**.

Você também pode atualizar apenas um componente específico. Use o seguinte comando para listar todos os pacotes instalados para os componentes do MySQL (para sistemas habilitados para dnf, substitua **yum** no comando por **dnf**):

```
sudo yum list installed | grep "^mysql"
```

Após identificar o nome do pacote do componente da sua escolha, atualize o pacote com o seguinte comando, substituindo *`package-name`* pelo nome do pacote. Para plataformas que não são habilitadas para dnf:

```
sudo yum update package-name
```

Para plataformas com dnf habilitado:

```
sudo dnf upgrade package-name
```

### Atualizando as Bibliotecas de Cliente Compartilhadas

Após atualizar o MySQL usando o repositório Yum, as aplicações compiladas com versões mais antigas das bibliotecas de cliente compartilhadas devem continuar a funcionar.

*Se você recompilar aplicativos e vincular dinamicamente com as bibliotecas atualizadas:* Como é típico com novas versões de bibliotecas compartilhadas, onde há diferenças ou adições na versionamento de símbolos entre as bibliotecas mais novas e as mais antigas (por exemplo, entre as bibliotecas de cliente compartilhadas padrão 8.0 mais novas e algumas versões mais antigas — anteriores ou variantes — das bibliotecas compartilhadas entregues nativamente pelos repositórios de software das distribuições Linux, ou de algumas outras fontes), quaisquer aplicativos compilados usando as bibliotecas compartilhadas atualizadas requerem essas bibliotecas atualizadas nos sistemas onde os aplicativos são implantados. Como esperado, se essas bibliotecas não estiverem no lugar, os aplicativos que requerem as bibliotecas compartilhadas falham. Por esse motivo, certifique-se de implantar os pacotes para as bibliotecas compartilhadas do MySQL nesses sistemas. Para fazer isso, adicione o repositório MySQL Yum aos sistemas (veja Adicionando o repositório MySQL Yum) e instale as bibliotecas compartilhadas mais recentes usando as instruções fornecidas em Instalando Produtos e Componentes Adicionais do MySQL com Yum.