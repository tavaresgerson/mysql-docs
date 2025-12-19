### 2.8.2 Pré-requisitos de instalação de fonte

A instalação do MySQL a partir do código-fonte requer várias ferramentas de desenvolvimento. Algumas dessas ferramentas são necessárias independentemente de você usar uma distribuição de código-fonte padrão ou uma árvore de código-fonte de desenvolvimento. Outros requisitos de ferramentas dependem do método de instalação que você usa.

Para instalar o MySQL a partir do código-fonte, os seguintes requisitos do sistema devem ser satisfeitos, independentemente do método de instalação:

- **CMake**, que é usado como estrutura de construção em todas as plataformas. **CMake** pode ser baixado em \[<http://www.cmake.org>]
- Embora algumas plataformas venham com suas próprias implementações de make, é altamente recomendável que você use o GNU make 3.75 ou posterior. Pode já estar disponível em seu sistema como gmake. GNU make está disponível em <http://www.gnu.org/software/make/>.

  Em sistemas semelhantes a Unix, incluindo Linux, você pode verificar a versão do seu sistema de **make** assim:

  ```
  $> make --version
  GNU Make 4.2.1
  ```
- O código-fonte do MySQL 8.4 permite o uso de recursos do C++17. Para permitir o nível necessário de suporte do C++17 em todas as plataformas suportadas, as seguintes versões mínimas do compilador são aplicáveis:

  - Linux: GCC 10 ou Clang 12
  - MacOS: XCode 10
  - Solaris: (*Anterior ao MySQL 8.4.4*) GCC 10; (*MySQL 8.4.4 e posterior*) GCC 11.4
  - Windows: Estúdio Visual 2019
- A construção do MySQL no Windows requer a versão do Windows 10 ou posterior. (Os binários do MySQL construídos em versões recentes do Windows geralmente podem ser executados em versões mais antigas.) Você pode determinar a versão do Windows executando \*\* WMIC.exe os get version\*\* no Prompt de comandos do Windows.
- A API C do MySQL requer um compilador C++ ou C99 para compilar.
- Uma biblioteca SSL é necessária para suporte de conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia. Por padrão, a compilação usa a biblioteca OpenSSL instalada no sistema host. Para especificar a biblioteca explicitamente, use a opção `WITH_SSL` quando você invoca **CMake**. Para informações adicionais, consulte a Seção 2.8.6,  Configurando suporte à biblioteca SSL.
- As \[Boost C++ libraries] (<http://www.boost.org/>) são necessárias para construir o MySQL (mas não para usá-lo).
- A biblioteca das maldições.
- Memória livre suficiente. Se você encontrar erros de compilação, como erro de compilador interno ao compilar arquivos de origem grandes, pode ser que você tenha pouca memória. Se compilar em uma máquina virtual, tente aumentar a alocação de memória.
- Perl é necessário se você pretende executar scripts de teste. A maioria dos sistemas Unix-like incluem Perl. Para Windows, você pode usar \[ActiveState Perl] (<https://www.activestate.com/products/perl/>). ou \[Strawberry Perl] (<https://strawberryperl.com/>).

Para instalar o MySQL a partir de uma distribuição de origem padrão, uma das seguintes ferramentas é necessária para descompactar o arquivo de distribuição:

- Para um `.tar.gz` arquivo **tar** comprimido: GNU `gunzip` para descompactar a distribuição e um **tar** razoável para descompactá-lo. Se o seu programa **tar** suporta a opção `z`, ele pode descompactar e descompactar o arquivo.

  O GNU **tar** é conhecido por funcionar. O **tar** padrão fornecido com alguns sistemas operacionais não é capaz de descompactar os nomes de arquivos longos na distribuição MySQL. Você deve baixar e instalar o GNU **tar**, ou se disponível, usar uma versão pré-instalada do GNU tar. Normalmente, isso está disponível como **gnutar**, **gtar**, ou como **tar** dentro de um diretório GNU ou Software Livre, como `/usr/sfw/bin` ou `/usr/local/bin`.
- Para um arquivo `.zip` Zip: **WinZip** ou outra ferramenta que possa ler arquivos `.zip`.
- Para um pacote RPM: O programa **rpmbuild** usado para construir a distribuição o desempacotará.

Para instalar o MySQL a partir de uma árvore de origem de desenvolvimento, são necessárias as seguintes ferramentas adicionais:

- O sistema de controle de revisão do Git é necessário para obter o código-fonte de desenvolvimento.
- **bison** 2.1 ou posterior, disponível em \[<http://www.gnu.org/software/bison/>]<http://www.gnu.org/software/bison/>. (A versão 1 não é mais suportada.) Use a versão mais recente do **bison** sempre que possível; se você tiver problemas, atualize para uma versão mais recente, em vez de retornar a uma anterior.

  **bison** está disponível em <http://www.gnu.org/software/bison/>. `bison` para Windows pode ser baixado em <http://gnuwin32.sourceforge.net/packages/bison.htm>. Faça o download do pacote rotulado Pacote completo, excluindo fontes. No Windows, a localização padrão para **bison** é o diretório `C:\Program Files\GnuWin32`. Alguns utilitários podem falhar em encontrar **bison** por causa do espaço no nome do diretório. Além disso, o Visual Studio pode simplesmente estar pendurado no caminho. Você pode resolver esses problemas instalando em um diretório que não contenha um espaço (por exemplo, `C:\GnuWin32`).
- No Solaris Express, **m4** deve ser instalado além de **bison**. **m4** está disponível em \[<http://www.gnu.org/software/m4/>]<http://www.gnu.org/software/m4/>).

::: info Note

Se você tiver que instalar qualquer programa, modifique sua variável de ambiente `PATH` para incluir todos os diretórios em que os programas estão localizados.

:::

Se você encontrar problemas e precisar apresentar um relatório de bugs, por favor, use as instruções na Seção 1.6, "Como relatar bugs ou problemas".
