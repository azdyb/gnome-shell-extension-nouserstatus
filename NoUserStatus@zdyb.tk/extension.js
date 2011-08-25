/* Copyright 2011 Aleksander Zdyb
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see http://www.gnu.org/licenses/.
 * 
 * Original author (GPL v2):
 * Copyright 2011 (c) Finnbarr P. Murphy.  All rights reserved.
 */

const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Shell = imports.gi.Shell;
const Lang = imports.lang;
const StatusMenu = imports.ui.statusMenu;
const Clutter = imports.gi.Clutter; 

const Gettext = imports.gettext.domain('gnome-shell');
const _ = Gettext.gettext;

//const ICON_NAME = 'distributor-logo';
const ICON_NAME = 'fedora-logo-icon';


function NoUserStatus() {
    this._init();
}


NoUserStatus.prototype = {
    effect: new Clutter.DesaturateEffect({ factor: 1 }),
    icon: new St.Icon({ reactive: true, icon_type: St.IconType.FULLCOLOR, style_class: 'popup-menu-icon', icon_name: ICON_NAME }),
    hover: false,
    menu_open: false,
    _init: function() {
        this.apply_effect();
        this.icon.connect("enter-event", Lang.bind(this, this.icon_enter));
        this.icon.connect("leave-event", Lang.bind(this, this.icon_leave));
        
        
        // future version -  let statusMenu = Main.panel._userMenu;
        let statusMenu = Main.panel._statusmenu;
        statusMenu.menu.connect("open-state-changed", Lang.bind(this, this.menu_state_changed));
        
        
        let box = statusMenu._name.get_parent();
        box.get_children().forEach(function (actor) { actor.destroy(); });
        
        let noimBox = new St.BoxLayout({ style_class: 'noim-icon'});
        noimBox.add_actor(this.icon);
        box.add_actor(noimBox);
        
        let _name = new St.Label();
        box.add(_name, { y_align: St.Align.MIDDLE, y_fill: false });
        
        statusMenu._updateUserName = function() {};
        statusMenu._updatePresenceIcon = function(presence, status) { };
        statusMenu._presence = null;
        
        let children = statusMenu.menu.box.get_children();
        let delete_separator = false;
        for (let i=0; i < children.length; i++) {
            let item = children[i];
            if (item._delegate.label) {
                let _label = item._delegate.label.get_text();
                if (_label == _('Available') || _label == _('Busy')) {
                   delete_separator = true;
                   item.destroy();
                }
            }
            if (delete_separator && (item._delegate instanceof PopupMenu.PopupSeparatorMenuItem)) {
                item.destroy();
                delete_separator = false;
            }
        }
    },
    
    icon_enter: function() {
        this.hover = true;
        this.apply_effect();
    },
    
    icon_leave: function() {
        this.hover = false;
        this.apply_effect();
    },
    
    menu_state_changed: function(menu, open) {
        if (open) {
          this.menu_open = true;
        } else {
          this.menu_open = false;
        }
        this.apply_effect();
    },
    
    apply_effect: function() {
        if (this.hover || this.menu_open) this.icon.remove_effect(this.effect);
        else this.icon.add_effect(this.effect);
    }
}


function main() {
    new NoUserStatus();
}
