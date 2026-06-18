## 3.8 Atualizando o MySQL com o Repositório MySQL Yum

Para plataformas baseadas no Yum suportadas (consulte a Seção 2.5.1, “Instalando o MySQL no Linux Usando o Repositório Yum do MySQL”, para uma lista), você pode realizar uma atualização in-place para o MySQL (ou seja, substituir a versão antiga e, em seguida, executar a nova versão usando os arquivos de dados antigos) com o repositório Yum do MySQL.

Notas

- Antes de realizar qualquer atualização no MySQL, siga cuidadosamente as instruções do Capítulo 3, *Atualizando o MySQL*. Entre outras instruções discutidas, é especialmente importante fazer backup do seu banco de dados antes da atualização.

- As instruções a seguir assumem que você instalou o MySQL com o repositório MySQL Yum ou com um pacote RPM baixado diretamente da página de download do MySQL Developer Zone; se não for esse o caso, siga as instruções em Substituindo uma Distribuição de Terceiros do MySQL Usando o Repositório MySQL Yum.

1. ### Selecionando uma Série de Destino

   Por padrão, o repositório MySQL Yum atualiza o MySQL para a versão mais recente da série de lançamentos que você escolheu durante a instalação (veja Selecionando uma Série de Lançamento para obter detalhes), o que significa, por exemplo, que uma instalação 5.7.x *não* é atualizada para uma versão 8.0.x automaticamente. Para atualizar para outra série de lançamentos, você deve primeiro desabilitar o subrepositório para a série que foi selecionada (por padrão, ou por você) e habilitar o subrepositório para a série de destino. Para fazer isso, consulte as instruções gerais fornecidas em Selecionando uma Série de Lançamento. Para atualizar do MySQL 5.7 para 8.0, realize o *inverso* dos passos ilustrados em Selecionando uma Série de Lançamento, desabilitando o subrepositório para a série MySQL 5.7 e habilitando-o para a série MySQL 8.0.

   Como regra geral, para fazer a atualização de uma série de lançamentos para outra, vá para a próxima série em vez de pular uma série. Por exemplo, se você está rodando o MySQL 5.6 atualmente e deseja fazer a atualização para 8.0, faça a atualização para o MySQL 5.7 primeiro antes de fazer a atualização para 8.0.

   Importante

   Para informações importantes sobre a atualização do MySQL 5.7 para 8.0, consulte a seção Atualizando do MySQL 5.7 para 8.0.

2. ### Atualizando o MySQL

   Atualize o MySQL e seus componentes pelo seguinte comando, para plataformas que não são habilitadas para dnf:

   ```
   sudo yum update mysql-server
   ```

   Para plataformas que estão habilitadas para dnf:

   ```
   sudo dnf upgrade mysql-server
   ```

   Alternativamente, você pode atualizar o MySQL dizendo ao Yum para atualizar tudo no seu sistema, o que pode levar muito mais tempo. Para plataformas que não são compatíveis com dnf:

   ```
   sudo yum update
   ```

   Para plataformas que estão habilitadas para dnf:

   ```
   sudo dnf upgrade
   ```

3. ### Reiniciar o MySQL

   O servidor MySQL é sempre reiniciado após uma atualização pelo Yum. Antes do MySQL 8.0.16, execute **mysql\_upgrade** após o reinício do servidor para verificar e, se necessário, resolver quaisquer incompatibilidades entre os dados antigos e o software atualizado. O **mysql\_upgrade** também realiza outras funções; para detalhes, consulte a Seção 6.4.5, “mysql\_upgrade — Verificar e Atualizar Tabelas do MySQL”. A partir do MySQL 8.0.16, essa etapa não é necessária, pois o servidor realiza todas as tarefas anteriormente tratadas pelo **mysql\_upgrade**.

Você também pode atualizar apenas um componente específico. Use o seguinte comando para listar todos os pacotes instalados para os componentes do MySQL (para sistemas com dnf, substitua **yum** no comando por **dnf**):

```
sudo yum list installed | grep "^mysql"
```

Depois de identificar o nome do pacote do componente da sua escolha, atualize o pacote com o seguinte comando, substituindo `package-name` pelo nome do pacote. Para plataformas que não são habilitadas para dnf:

```
sudo yum update package-name
```

Para plataformas habilitadas para dnf:

```
sudo dnf upgrade package-name
```

### Atualizando as Bibliotecas de Cliente Compartilhadas

Após a atualização do MySQL usando o repositório Yum, as aplicações compiladas com versões mais antigas das bibliotecas de cliente compartilhadas devem continuar funcionando.

*Se você recompilar aplicativos e vinculá-los dinamicamente com as bibliotecas atualizadas:* Como é típico com novas versões de bibliotecas compartilhadas, onde há diferenças ou adições na versão dos símbolos entre as bibliotecas mais novas e as mais antigas (por exemplo, entre as bibliotecas cliente compartilhadas padrão 8.0 mais novas e algumas versões mais antigas — anteriores ou variantes — das bibliotecas compartilhadas entregues nativamente pelos repositórios de software das distribuições Linux, ou de outras fontes), quaisquer aplicativos compilados usando as bibliotecas compartilhadas mais novas e atualizadas requerem essas bibliotecas atualizadas nos sistemas onde os aplicativos são implantados. Como esperado, se essas bibliotecas não estiverem no lugar, os aplicativos que requerem as bibliotecas compartilhadas falharão. Por essa razão, certifique-se de implantar os pacotes para as bibliotecas compartilhadas do MySQL nesses sistemas. Para fazer isso, adicione o repositório MySQL Yum aos sistemas (veja Adicionando o repositório MySQL Yum) e instale as bibliotecas compartilhadas mais recentes usando as instruções fornecidas em Instalando Produtos e Componentes Adicionais do MySQL com o Yum.
