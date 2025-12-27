## 3.8 Atualizando o MySQL com o Repositório Yum do MySQL

Para plataformas baseadas no Yum suportadas (consulte a Seção 2.5.1, “Instalando o MySQL no Linux Usando o Repositório Yum do MySQL”, para uma lista), você pode realizar uma atualização local do MySQL (ou seja, substituir a versão antiga e, em seguida, executar a nova versão usando os arquivos de dados antigos) com o repositório Yum do MySQL.

::: info Notas

* Uma série de inovação, como o MySQL 9.5, está em uma trilha separada da série LTS, como o MySQL 8.4. A série LTS está ativa por padrão.
* Antes de realizar qualquer atualização no MySQL, siga cuidadosamente as instruções no Capítulo 3, *Atualizando o MySQL*. Entre outras instruções discutidas, é especialmente importante fazer backup do seu banco de dados antes da atualização.
* As instruções seguintes assumem que você instalou o MySQL com o repositório Yum do MySQL ou com um pacote RPM baixado diretamente da página de download do MySQL Developer Zone; se esse não for o caso, siga as instruções em Substituindo uma Distribuição Terceira Native do MySQL.

:::

1. ### Selecionando uma Série de Alvo

Por padrão, o repositório Yum do MySQL atualiza o MySQL para a versão mais recente na trilha de lançamento que você escolheu durante a instalação (consulte Selecionando uma Série de Lançamento para detalhes), o que significa, por exemplo, que uma instalação 8.0.x *não* é atualizada para uma versão 8.4.x automaticamente. Para atualizar para outra série de lançamento, você deve primeiro desabilitar a subrepositório para a série que foi selecionada (por padrão, ou por você) e habilitar a subrepositório para sua série de alvo. Para fazer isso, consulte as instruções gerais dadas em Selecionando uma Série de Lançamento para editar as entradas da subrepositório no arquivo `/etc/yum.repos.d/mysql-community.repo`.

Como regra geral, para fazer uma atualização de uma série de correções de bugs para outra, vá para a próxima série de correções de bugs, em vez de pular uma série de correções de bugs. Por exemplo, se você está atualmente rodando o MySQL 5.7 e deseja fazer a atualização para o MySQL 8.4, faça a atualização para o MySQL 8.0 primeiro antes de fazer a atualização para o MySQL 8.4. Para detalhes adicionais, consulte a Seção 3.5, “Alterações no MySQL 8.4”.

* Para informações importantes sobre a atualização do MySQL 5.7 para 8.0, consulte Atualizando do MySQL 5.7 para 8.0.
* Para informações importantes sobre a atualização do MySQL 8.0 para 8.4, consulte Atualizando do MySQL 8.0 para 8.4.
* A atualização local do MySQL não é suportada pelo repositório MySQL Yum. Siga as instruções no Capítulo 4, *Atualizando o MySQL*.

2. ### Atualizando o MySQL

Atualize os componentes do MySQL usando comandos padrão do `yum` (ou `dnf`), como o MySQL Server:

```
   sudo yum update mysql-server
   ```

Para plataformas que são habilitadas para dnf:

```
   sudo dnf upgrade mysql-server
   ```

Alternativamente, você pode atualizar o MySQL dizendo ao Yum para atualizar tudo no seu sistema, o que pode levar muito mais tempo. Para plataformas que não são habilitadas para dnf:

```
   sudo yum update
   ```

Para plataformas que são habilitadas para dnf:

```
   sudo dnf upgrade
   ```

::: info Nota

O servidor MySQL sempre reinicia após uma atualização pelo Yum.

:::

Você também pode atualizar apenas um componente específico. Use o seguinte comando para listar todos os pacotes instalados para os componentes do MySQL (para sistemas habilitados para dnf, substitua `yum` no comando por `dnf`):

```
sudo yum list installed | grep "^mysql"
```

Após identificar o nome do pacote do componente de sua escolha, atualize o pacote com o seguinte comando, substituindo `package-name` pelo nome do pacote. Para plataformas que não são habilitadas para dnf:

```
sudo yum update package-name
```

Para plataformas habilitadas para dnf:

```
sudo dnf upgrade package-name
```

### Atualizando as Bibliotecas de Cliente Compartilhadas

Após atualizar o MySQL usando o repositório Yum, as aplicações compiladas com versões mais antigas das bibliotecas de cliente compartilhadas devem continuar funcionando.

*Se você recompilar aplicativos e vinculá-los dinamicamente com as bibliotecas atualizadas:* Como é típico com novas versões de bibliotecas compartilhadas, onde há diferenças ou adições na versão dos símbolos entre as bibliotecas mais novas e as mais antigas (por exemplo, entre as bibliotecas cliente compartilhadas padrão 8.4 mais recentes e algumas versões mais antigas — anteriores ou variantes — das bibliotecas compartilhadas entregues nativamente pelos repositórios de software das distribuições Linux, ou de outras fontes), quaisquer aplicativos compilados usando as bibliotecas compartilhadas mais recentes e atualizadas requerem essas bibliotecas atualizadas nos sistemas onde os aplicativos são implantados. Como esperado, se essas bibliotecas não estiverem no lugar, os aplicativos que requerem as bibliotecas compartilhadas falharão. Por essa razão, certifique-se de implantar os pacotes para as bibliotecas compartilhadas do MySQL nesses sistemas. Para fazer isso, adicione o repositório MySQL Yum aos sistemas (consulte Adicionando o repositório MySQL Yum) e instale as bibliotecas compartilhadas mais recentes usando as instruções fornecidas em Instalando Produtos e Componentes Adicionais do MySQL com o Yum.